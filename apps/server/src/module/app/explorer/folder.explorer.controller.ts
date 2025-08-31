
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Param, Post, Put, Req, Res, UseGuards } from "@nestjs/common";
import { ApiTags, ApiHeader, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { CrepenLoggerService } from "../common/logger/logger.service";
import { CrepenExplorerFolderService } from "./folder.explorer.service";
import { BaseResponse } from "@crepen-nest/lib/common/base.response";
import { AuthUser } from "@crepen-nest/lib/extensions/decorator/param/auth-user.param.decorator";
import { AuthJwtGuard } from "@crepen-nest/module/config/passport/jwt/jwt.guard";
import { I18n, I18nContext } from "nestjs-i18n";
import { Request as ExpressRequest, Response as ExpressResponse } from "express";
import { FileNotUploadedError } from "@crepen-nest/lib/error/api/explorer/file_not_uploaded.file.error";
import * as path from "path";
import { ConfigService } from "@nestjs/config";
import * as crypto from 'crypto'
import * as fs from 'fs';
import { FileUploadFailedError } from "@crepen-nest/lib/error/api/explorer/file_upload_failed.file.error";
import { CommonError } from "@crepen-nest/lib/error/common.error";
import { ExceptionResultFactory } from "@crepen-nest/lib/extensions/filter/common.exception.filter";
import { FolderNotFoundError } from "@crepen-nest/lib/error/api/explorer/not_found.folder.error";
import { ExplorerAddFolderRequest } from "./dto/add-folder.explorer.request";
import { TokenTypeEnum } from "../auth/enum/token-type.auth.request";
import { UserEntity } from "../user/entity/user.default.entity";
import { DatabaseService } from "@crepen-nest/module/config/database/database.config.service";
import { CrepenExplorerDefaultService } from "./services/explorer.service";
import { DynamicConfigService } from "@crepen-nest/module/config/dynamic-config/dynamic-config.service";
import * as Busboy from 'busboy'
import { CrepenExplorerFileService } from "./services/file.explorer.service";

@ApiTags('[EXPLORER] 탐색기 - 폴더')
@ApiHeader({
    name: 'Accept-Language',
    required: false,
    enum: ['en', 'ko']
})
@Controller('explorer/folder')
export class CrepenExplorerFolderController {
    constructor(
        private readonly fileService: CrepenExplorerFileService,
        private readonly folderService: CrepenExplorerFolderService,
        private readonly explorerService: CrepenExplorerDefaultService,
        private readonly configService: ConfigService,
        private readonly databaseService: DatabaseService,
        private readonly logService: CrepenLoggerService,
        private readonly dynamicConfig: DynamicConfigService
    ) { }

    @Get(':uid')
    @ApiBearerAuth('token')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthJwtGuard.whitelist(TokenTypeEnum.ACCESS_TOKEN))
    async getFolderData(
        @Req() req: Request,
        @AuthUser() user: UserEntity,
        @I18n() i18n: I18nContext,
        @Param('uid') folderUid: string,
    ) {

        return (await this.databaseService.getDefault()).transaction(async (manager) => {


            const folderData = await this.folderService.getFolderDataByUid(folderUid);
            const folderPath = await this.folderService.getFolderHierarchy(folderUid, { manager: manager });



            return BaseResponse.ok(
                {
                    dir: folderData,
                    path: folderPath
                },
                HttpStatus.OK,
                i18n.t('common.SUCCESS')
            )
        })
    }


    @Put(':uid/file/upload')
    @ApiOperation({ summary: '폴더 내 파일 업로드', description: '폴더 내 파일 업로드' })
    @ApiBearerAuth('token')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthJwtGuard.whitelist(TokenTypeEnum.ACCESS_TOKEN))
    // @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @Req() req: ExpressRequest,
        @AuthUser() user: UserEntity | undefined,
        @I18n() i18n: I18nContext,
        @Param('uid') uid: string,
        @Res() res: ExpressResponse,
        @Headers('content-length') contentLength: string,
        @Headers('content-disposition') contentDisposition: string,
        @Headers('content-file-type') fileType: string
    ) {

        try {
            if (isNaN(Number(contentLength)) || Number(contentLength) === 0) {
                throw new FileNotUploadedError();
            }


            let fileName = 'uploaded_file';
            if (contentDisposition) {
                const match = /filename="?([^"]+)"?/.exec(contentDisposition);
                if (match) fileName = match[1];
            }

            const fileUid = crypto.randomUUID();


            const saveTempStreamDir = path.join(
                this.dynamicConfig.get('path.data'),
                'file/temp'
            )

            if (!fs.existsSync(saveTempStreamDir)) {
                fs.mkdirSync(saveTempStreamDir, { recursive: true });
            }

            const saveTempStreamFilePath = path.join(
                saveTempStreamDir,
                fileUid + '.CPCDN'
            )

            let fileSize = 0;



            const busboy = Busboy({ headers: req.headers });

            busboy.on('file', (fieldName, fileStream) => {

                fileStream
                    .on('data', (chunk) => { fileSize += chunk.length; })

                fileStream
                    // .pipe(cipher)
                    .pipe(fs.createWriteStream(saveTempStreamFilePath))
                    .on('error', (e) => {
                        let error: CommonError = undefined;
                        if (e instanceof CommonError) {
                            error = e;
                        }
                        else {
                            error = new FileUploadFailedError();
                        }

                        ExceptionResultFactory.current(res, i18n, error)
                            .sendResponse();


                    })
                    .on('finish', () => {
                        const addFileEntity = this.fileService.addFile(
                            decodeURIComponent(fileName),
                            fileUid,
                            fileType,
                            fileSize,
                            uid,
                            user
                        )
                            .then(result => {
                                res.status(HttpStatus.OK).send(
                                    BaseResponse.ok(
                                        {
                                            uuid: result.uid
                                        },
                                        HttpStatus.OK,
                                        i18n.t('common.SUCCESS'),
                                    )
                                )
                            })
                            .catch(e => {
                                let error: CommonError = undefined;
                                if (e instanceof CommonError) {
                                    error = e;
                                }
                                else {
                                    error = new FileUploadFailedError();
                                }

                                ExceptionResultFactory.current(res, i18n, error)
                                    .sendResponse();
                            })


                    })
                   

            })

            req.pipe(busboy);


            // const streamUploadPromise = new Promise<void>((resolve, reject) => {
            //     req
            //         // .pipe(cipher)
            //         .on('data', (chunk) => { fileSize += chunk.length; })
            //         .pipe(fs.createWriteStream(saveTempStreamFilePath))
            //         .on('finish', () => { resolve(); })
            //         .on('error', (err) => reject(err));

            //     req.on('error', (err) => reject(err));
            // })

            // streamUploadPromise
            //     .then(async rp => {
            //         const addFileEntity = await this.fileService.addFile(
            //             decodeURIComponent(fileName),
            //             fileUid,
            //             iv,
            //             fileType,
            //             fileSize,
            //             uid,
            //             user
            //         )

            //         res.status(HttpStatus.OK).send(
            //             BaseResponse.ok(
            //                 {
            //                     uuid: addFileEntity.uid
            //                 },
            //                 HttpStatus.OK,
            //                 i18n.t('common.SUCCESS'),
            //             )
            //         )
            //     })
            //     .catch(e => {
            //         let error: CommonError = undefined;
            //         if (e instanceof CommonError) {
            //             error = e;
            //         }
            //         else {
            //             error = new FileUploadFailedError();
            //         }

            //         ExceptionResultFactory.current(res, i18n, error)
            //             .getResponse();
            //     })






        }
        catch (e) {
            let error: CommonError = undefined;
            if (e instanceof CommonError) {
                error = e;
            }
            else {
                error = new FileUploadFailedError();
            }

            ExceptionResultFactory.current(res, i18n, error)
                .sendResponse();
        }
    }




    @Post(':uid/folder/add')
    @ApiOperation({ summary: '폴더 내 새로운 폴더 생성', description: '폴더 내 새로운 폴더 생성' })
    @ApiBearerAuth('token')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthJwtGuard.whitelist(TokenTypeEnum.ACCESS_TOKEN))
    async addFolder(
        @Req() req: Request,
        @AuthUser() user: UserEntity,
        @I18n() i18n: I18nContext,
        @Param('uid') parentFolderUid: string,
        @Body() reqBody: ExplorerAddFolderRequest
    ) {
        if (parentFolderUid !== 'root') {
            const parentFolderData = await this.folderService.getFolderDataByUid(parentFolderUid);

            if (!parentFolderData) {
                throw new FolderNotFoundError();
            }
        }


        const addFolder = await this.folderService.addFolder(user, parentFolderUid, reqBody.folderName);

        return BaseResponse.ok(
            {
                folderUid: addFolder.uid
            },
            HttpStatus.OK,
            i18n.t('common.SUCCESS')
        )
    }



}