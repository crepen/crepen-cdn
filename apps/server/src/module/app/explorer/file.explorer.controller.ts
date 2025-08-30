import { Controller, Get, Header, HttpCode, HttpStatus, Options, Param, Post, Put, Req, Res, StreamableFile, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CrepenLoggerService } from "../common/logger/logger.service";
import { CrepenExplorerFileService } from "./file.explorer.service";
import { CrepenExplorerFolderService } from "./folder.explorer.service";
import { AuthJwtGuard } from "@crepen-nest/module/config/passport/jwt/jwt.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request as ExpressRequest } from "express";
import { AuthUser } from "@crepen-nest/lib/extensions/decorator/param/auth-user.param.decorator";
import { I18n, I18nContext } from "nestjs-i18n";
import { memoryStorage } from "multer";
import { BaseResponse } from "@crepen-nest/lib/common/base.response";
import { FolderNotFoundError } from "@crepen-nest/lib/error/api/explorer/not_found.folder.error";
import { ObjectUtil } from "@crepen-nest/lib/util";
import { TokenTypeEnum } from "../auth/enum/token-type.auth.request";
import { UserEntity } from "../user/entity/user.default.entity";
import { DatabaseService } from "@crepen-nest/module/config/database/database.config.service";
import { instanceToPlain, plainToInstance } from "class-transformer";
import { ExplorerFileEntity } from "./entity/file.explorer.default.entity";
import { FileNotFoundError } from "@crepen-nest/lib/error/api/explorer/not_found_file.error";
import * as path from 'path';
import { DynamicConfigService } from "@crepen-nest/module/config/dynamic-config/dynamic-config.service";
import * as fs from 'fs';
import * as crypto from "crypto";
import * as express from 'express';
import * as Busboy from "busboy";
import { CommonError } from "@crepen-nest/lib/error/common.error";
import { ExceptionResultFactory } from "@crepen-nest/lib/extensions/filter/common.exception.filter";

@ApiTags('[EXPLORER] 탐색기 - 파일')
@ApiHeader({
    name: 'Accept-Language',
    required: false,
    enum: ['en', 'ko']
})
@Controller('explorer/file')
export class CrepenExplorerFileController {
    constructor(
        private readonly fileService: CrepenExplorerFileService,
        private readonly folderService: CrepenExplorerFolderService,
        private readonly logService: CrepenLoggerService,
        private readonly databaseService: DatabaseService,
        private readonly dynamicConfig: DynamicConfigService
    ) { }


    @Put(':uid/upload')
    @ApiOperation({ summary: '단일 파일 등록', description: '단일 파일 등록' })
    @ApiBearerAuth('token')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthJwtGuard.whitelist(TokenTypeEnum.ACCESS_TOKEN))
    @UseInterceptors(FileInterceptor('file', {
        storage: memoryStorage()
    }))
    async uploadFile(
        @Req() req: ExpressRequest,
        @AuthUser() user: UserEntity | undefined,
        @I18n() i18n: I18nContext,
        @UploadedFile() file: Express.Multer.File,
        @Param('uid') uid: string
    ) {
        const folderData = await this.folderService.getFolderDataByUid(uid);

        if (ObjectUtil.isNullOrUndefined(folderData) && uid.toLowerCase() !== 'root') {
            throw new FolderNotFoundError();
        }

        return BaseResponse.ok(
            {
                parentFolderUid: uid,
                fileSize: file.size
            },
            HttpStatus.OK,
            i18n.t('common.SUCCESS')
        )
    }


    @Get(':uid/info')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthJwtGuard.whitelist(TokenTypeEnum.ACCESS_TOKEN))
    async getFileInfo(
        @Req() req: Request,
        @I18n() i18n: I18nContext,
        @AuthUser() user: UserEntity,
        @Param('uid') uid: string,
    ) {
        return (await this.databaseService.getDefault()).transaction(async (manager) => {

            console.log('FILE_UID', uid);

            const fileInfo: ExplorerFileEntity = await this.fileService.getFileData(uid);




            return BaseResponse.ok(
                fileInfo,
                HttpStatus.OK,
                i18n.t('common.SUCCESS')
            )
        })
    }


    @Put(':uid/publish')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthJwtGuard.whitelist(TokenTypeEnum.ACCESS_TOKEN))
    async updateFilePublish(
        @Req() req: Request,
        @I18n() i18n: I18nContext,
        @AuthUser() user: UserEntity,
        @Param('uid') uid: string,
    ) {
        return (await this.databaseService.getDefault()).transaction(async (manager) => {
            return BaseResponse.ok(
                undefined,
                HttpStatus.OK,
                i18n.t('common.SUCCESS')
            )
        })
    }

    @Post('test/upload')
    async uploadTest(
        @Res() res: express.Response,
        @Req() req: express.Request,
        @I18n() i18n: I18nContext
    ) {

        const busboy = Busboy({ headers: req.headers })

        busboy.on('file', (fieldName, fileStream) => {

            fileStream
                .pipe(fs.createWriteStream(`C:\\Temp\\testupload\\test.png`))
                .on('error', () => {
                    res.status(403).send(
                        BaseResponse.ok(
                            undefined,
                            HttpStatus.OK,
                            i18n.t('common.SUCCESS'),
                        )
                    )
                })
                .on('finish', () => {
                    res.status(HttpStatus.OK).send(
                        BaseResponse.ok(
                            undefined,
                            HttpStatus.OK,
                            i18n.t('common.SUCCESS'),
                        )
                    )
                })
                .on('end', () => {
                    res.status(HttpStatus.OK).send(
                        BaseResponse.ok(
                            undefined,
                            HttpStatus.OK,
                            i18n.t('common.SUCCESS'),
                        )
                    )
                })

        })

        req.pipe(busboy);

        // req
        //     .on('data', (chunk) => { console.log('UPLOAD CHUNK : ', chunk) })
        //     .pipe(fs.createWriteStream(`C:\\Temp\\testupload\\test.png`))
        //     .on('error', () => {
        //         res.status(403).send(
        //             BaseResponse.ok(
        //                 undefined,
        //                 HttpStatus.OK,
        //                 i18n.t('common.SUCCESS'),
        //             )
        //         )
        //     })
        //     .on('finish', () => {
        //         res.status(HttpStatus.OK).send(
        //             BaseResponse.ok(
        //                 undefined,
        //                 HttpStatus.OK,
        //                 i18n.t('common.SUCCESS'),
        //             )
        //         )
        //     })
        //     .on('end', () => {
        //         res.status(HttpStatus.OK).send(
        //             BaseResponse.ok(
        //                 undefined,
        //                 HttpStatus.OK,
        //                 i18n.t('common.SUCCESS'),
        //             )
        //         )
        //     })

    }



    @Options('download/:filename')
    optionsDonwloadFileHandler(@Res() res: express.Response) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.status(204).send();
    }


    @Get('download/:filename')
    @HttpCode(HttpStatus.OK)
    @Header('Content-Type', 'application/octet-stream')
    @UseGuards(AuthJwtGuard.whitelist(TokenTypeEnum.ACCESS_TOKEN))
    async downloadFile(
        @Req() req: Request,
        @Res() res: express.Response,
        @I18n() i18n: I18nContext,
        @AuthUser() user: UserEntity,
        @Param('filename') fileName: string,
    ) {
        return (await this.databaseService.getDefault()).transaction(async (manager) => {

            const fileInfo = await this.fileService.getFileDataByFileName(fileName, { manager: manager });

            if (!fileInfo) {
                // NOT_FOUND_FILE_ERROR
                throw new FileNotFoundError();
            }

            const saveFilePath = path.join(
                this.dynamicConfig.get('path.data'),
                'file',
                fileInfo.filePath,
                fileInfo.storeFileName
            );

            if (!fs.existsSync(saveFilePath)) {
                throw new FileNotFoundError();
            }

            // console.log(saveFilePath);

            console.log("DOWNLOAD_IV", fileInfo.fileEncIv);



            // console.log(readFileStream);

            const globalSecret = this.dynamicConfig.get<string>('secret');
            const key = globalSecret.length < 32 ? globalSecret.padEnd(32, '-') : globalSecret.slice(0, 32);
            const decipher = crypto.createDecipheriv('aes-256-cbc', key, fileInfo.fileEncIv);

            console.log(fileInfo.fileEncIv.length)

            res.setHeader('Content-Type', fileInfo.fileMimeType || 'application/octet-stream');
            res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileInfo.fileName)}"`);

            const readFileStream = fs.createReadStream(saveFilePath);

            // const downloadStreamPromise = new Promise<void>((resolve, reject) => {
            //     readFileStream.pipe(decipher)
            //         .on('data', (chunk) => console.log(chunk))
            //         .on('finish', () => { resolve(); })
            //         .on('error', (err) => reject(err));
            // })


            console.log('DECRYPT CIPHER', 'aes-256-cbc', key, fileInfo.fileEncIv);

            readFileStream
                .pipe(decipher)
                .on('error', (e) => {

                    ExceptionResultFactory.current(res, i18n, e)
                        .getResponse();


                })
                .pipe(res);
            // return new StreamableFile(readFileStream)

            // return BaseResponse.ok(
            //     undefined,
            //     HttpStatus.OK,
            //     i18n.t('common.SUCCESS')
            // )
        })
    }




    // @Options('download/publish/:filename')
    // optionsDownloadPublishFileHandler(@Res() res: express.Response) {
    //     res.header('Access-Control-Allow-Origin', '*');
    //     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    //     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    //     res.status(204).send();
    // }


    @Get('download/publish/:filename')
    @HttpCode(HttpStatus.OK)
    @Header('Content-Type', 'application/octet-stream')
    // @UseGuards(AuthJwtGuard.whitelist(TokenTypeEnum.ACCESS_TOKEN))
    async downloadPublishedFile(
        @Req() req: Request,
        @Res() res: express.Response,
        @I18n() i18n: I18nContext,
        @AuthUser() user: UserEntity,
        @Param('filename') fileName: string,
    ) {
        return (await this.databaseService.getDefault()).transaction(async (manager) => {

            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

            const fileInfo = await this.fileService.getFileDataByFileName(fileName, { manager: manager });

            if (!fileInfo) {
                // NOT_FOUND_FILE_ERROR
                throw new FileNotFoundError();
            }

            const saveFilePath = path.join(
                this.dynamicConfig.get('path.data'),
                'file',
                fileInfo.filePath,
                fileInfo.storeFileName
            );

            if (!fs.existsSync(saveFilePath)) {
                throw new FileNotFoundError();
            }

            // console.log(saveFilePath);

            console.log("DOWNLOAD_IV", fileInfo.fileEncIv);



            // console.log(readFileStream);

            const globalSecret = this.dynamicConfig.get<string>('secret');
            const key = globalSecret.length < 32 ? globalSecret.padEnd(32, '-') : globalSecret.slice(0, 32);
            const decipher = crypto.createDecipheriv('aes-256-cbc', key, fileInfo.fileEncIv);

            console.log(fileInfo.fileEncIv.length)

            res.setHeader('Content-Type', fileInfo.fileMimeType || 'application/octet-stream');
            res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileInfo.fileName)}"`);

            const readFileStream = fs.createReadStream(saveFilePath);

            // const downloadStreamPromise = new Promise<void>((resolve, reject) => {
            //     readFileStream.pipe(decipher)
            //         .on('data', (chunk) => console.log(chunk))
            //         .on('finish', () => { resolve(); })
            //         .on('error', (err) => reject(err));
            // })


            console.log('DECRYPT CIPHER', 'aes-256-cbc', key, fileInfo.fileEncIv);

            readFileStream
                .pipe(decipher)
                .on('error', (e) => {

                    ExceptionResultFactory.current(res, i18n, e)
                        .getResponse();


                })
                .pipe(res);
            // return new StreamableFile(readFileStream)

            // return BaseResponse.ok(
            //     undefined,
            //     HttpStatus.OK,
            //     i18n.t('common.SUCCESS')
            // )
        })
    }


}