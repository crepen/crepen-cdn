import { Body, Controller, Delete, Get, Header, Headers, HttpCode, HttpStatus, Param, Post, Put, Query, Req, Res, StreamableFile, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiTags, ApiHeader, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { CrepenFileRouteService } from "./file.service";
import { CrepenAuthJwtGuard } from "@crepen-nest/config/passport/jwt/jwt.guard";
import { JwtUserExpressRequest, JwtUserRequest } from "@crepen-nest/interface/jwt";
import { I18n, I18nContext } from "nestjs-i18n";
import { BaseResponse } from "@crepen-nest/lib/util/base.response";
import { StringUtil } from "@crepen-nest/lib/util/string.util";
import { CrepenLocaleHttpException } from "@crepen-nest/lib/exception/crepen.http.exception";
import { ObjectUtil } from "@crepen-nest/lib/util/object.util";
import { FileInterceptor } from "@nestjs/platform-express";
import { AddFileDto, RelationFileDto } from "./dto/file.dto";
import { CrepenFolderRouteService } from "../folder/folder.service";
import { Transaction } from "typeorm";
import { Request as ExpressRequest, Response } from "express";
import { createReadStream } from "fs";
import { CrepenFileError } from "./exception/file.exception";
import { EditFileDto } from "./dto/edit.file.dto";
import { FileEntity } from "./entity/file.entity";

@ApiTags('[Common] 사용자 파일 관리 컨트롤러')
@ApiHeader({
    name: 'Accept-Language', required: false, enum: ['en', 'ko']
})
@Controller('explorer/file')
export class CrepenFileRouteController {
    constructor(
        private readonly fileService: CrepenFileRouteService,
        private readonly folderService: CrepenFolderRouteService
    ) { }

    //#region FILE INFO READ

    @Get(':uid')
    //#region Decorator
    @ApiOperation({ summary: '파일 정보 조회', description: '파일 정보 조회' })
    @ApiBearerAuth('token')
    @HttpCode(HttpStatus.OK)
    @UseGuards(CrepenAuthJwtGuard.whitelist('access_token'))
    //#endregion
    async getFileData(
        @Req() req: JwtUserRequest,
        @I18n() i18n: I18nContext,
        @Param('uid') uid: string
    ) {
        const fileData = await this.fileService.getFileWithStore(uid);

        if (ObjectUtil.isNullOrUndefined(fileData)) {
            throw CrepenFileError.FILE_NOT_FOUND;
        }

        if (fileData.ownerUid !== req.user.entity.uid) {
            throw CrepenFileError.FILE_ACCESS_UNAUTHORIZED;
        }

        return BaseResponse.ok(
            fileData,
            HttpStatus.OK,
            i18n.t('common.SUCCESS')
        )
    }

    //#endregion FILE INFO READ


    //#region FILE INFO CONTROL

    @Post('rel')
    //#region Decorator
    @ApiOperation({ summary: '파일 연결/등록', description: '파일 연결/등록' })
    @ApiBearerAuth('token')
    @HttpCode(HttpStatus.OK)
    @UseGuards(CrepenAuthJwtGuard.whitelist('access_token'))
    //#endregion
    async relationFile(
        @Req() req: JwtUserExpressRequest,
        @I18n() i18n: I18nContext,
        @Body() bodyData: RelationFileDto,
    ) {
        console.log(bodyData);

        const relationFile = this.fileService.relationFile(bodyData.fileUid, bodyData.fileTitle, bodyData.folderUid, req.user.entity.uid);

        return BaseResponse.ok(
            undefined,
            HttpStatus.OK,
            i18n.t('cloud_file.FILE_COMMON_SUCCESS')
        )
    }

    //#endregion FILE INFO CONTROL


    //#region FILE UPLOAD

    @Put('stream')
    //#region Decorator
    @ApiOperation({ summary: '단일 파일 등록', description: '단일 파일 등록' })
    @ApiBearerAuth('token')
    @HttpCode(HttpStatus.OK)
    @UseGuards(CrepenAuthJwtGuard.whitelist('access_token'))
    @UseInterceptors(FileInterceptor('file'))
    //#endregion
    async addFileStream(
        @Req() req: JwtUserExpressRequest,
        @Res() res: Response,
        @I18n() i18n: I18nContext,
        @Headers('x-file-name') fileName: string,
        @Headers('x-file-type') fileType: string
    ) {


        const chunks: Buffer[] = [];

        req.on('data', (chunk) => {
            chunks.push(chunk);
        })

        req.on('end', () => {

            try {
                const fileBuffer = Buffer.concat(chunks);
                const file: Express.Multer.File = {
                    size: fileBuffer.length,
                    originalname: fileName,
                    filename: fileName,
                    mimetype: fileType,
                    buffer: fileBuffer,
                    fieldname: 'file',
                    encoding: '7bit',
                    destination: '',
                    path: '',
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    stream: undefined as any,
                }

                const saveFile = this.fileService.saveFile(file, req.user.entity.uid);

                saveFile
                    .then(fileRes => {
                        console.log(fileRes);

                        res.status(200).send(
                            BaseResponse.ok(
                                fileRes.uid,
                                HttpStatus.OK,
                                i18n.t('cloud_file.FILE_COMMON_SUCCESS')
                            )
                        )
                    })
                    .catch(err => {
                        if (err instanceof CrepenLocaleHttpException) {

                            if (err.innerError !== undefined) {
                                console.log(`ERR : ${err?.message}`)
                                console.log('INNER_ERROR', err?.innerError);
                            }

                            res.status(500).send(
                                BaseResponse.error(
                                    err.getStatus(),
                                    err.getTransLocaleErrorMessage(i18n),
                                    err.transLocaleCode
                                )
                            )
                        }
                        else {
                            res.status(500).send(
                                BaseResponse.error(
                                    HttpStatus.INTERNAL_SERVER_ERROR,
                                    i18n.t('common.INTERNAL_SERVER_ERROR'),
                                    'INTERNAL_SERVER_ERROR'
                                )
                            )
                        }
                    })
            }
            catch (err) {
                if (err instanceof CrepenLocaleHttpException) {

                    if (err.innerError !== undefined) {
                        console.log(`ERR : ${err?.message}`)
                        console.log('INNER_ERROR', err?.innerError);
                    }

                    res.status(500).send(
                        BaseResponse.error(
                            err.getStatus(),
                            err.getTransLocaleErrorMessage(i18n),
                            err.transLocaleCode
                        )
                    )
                }
                else {
                    res.status(500).send(
                        BaseResponse.error(
                            HttpStatus.INTERNAL_SERVER_ERROR,
                            i18n.t('common.INTERNAL_SERVER_ERROR'),
                            'INTERNAL_SERVER_ERROR'
                        )
                    )
                }

            }



            // res.status(200).send(
            //     BaseResponse.ok(
            //         undefined,
            //         HttpStatus.OK,
            //         i18n.t('cloud_file.FILE_COMMON_SUCCESS')
            //     )
            // )
        })

        req.on('error', (e) => {
            console.log('ERRRRRRR');
            throw new CrepenLocaleHttpException('', e.message, HttpStatus.INTERNAL_SERVER_ERROR);
        })




        return BaseResponse.ok();
    }

    //#endregion FILE UPLOAD


    //#region FILE DOWNLOAD

    @Get(':uid/download')
    //#region Decorator
    @ApiOperation({ summary: '파일 다운로드 ', description: '파일 다운로드 (스트림 지원)' })
    @ApiBearerAuth('token')
    @HttpCode(HttpStatus.OK)
    @UseGuards(CrepenAuthJwtGuard.whitelist('access_token'))
    //#endregion
    async downloadFileStream(
        @Req() req: JwtUserRequest,
        @Res({ passthrough: true }) res: Response,
        @I18n() i18n: I18nContext,
        @Param('uid') uid: string
    ) {
        const fileData = await this.fileService.getFileData(uid);

        const fileSize = fileData.buffer.length;
        const range = res.req.headers.range;

        if (range) {
            const parts = range.replace(/bytes=/, '').split('-');
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            const chunksize = (end - start) + 1;


            const chunk = fileData.buffer.subarray(start, end + 1);

            res.status(HttpStatus.PARTIAL_CONTENT);
            res.header('Content-Range', `bytes ${start}-${end}/${fileSize}`);
            res.header('Accept-Ranges', 'bytes');
            res.header('Content-Length', chunksize.toString());
            res.header('Content-Type', fileData.mimetype);

            return new StreamableFile(chunk);
        } else {
            res.status(HttpStatus.OK); // 200 OK
            res.header('Content-Length', fileSize.toString());
            res.header('Content-Type', fileData.mimetype);

            return new StreamableFile(fileData.buffer);
        }
    }

    @Get(':uid/download/shared')
    //#region Decorator
    @ApiOperation({ summary: '파일 다운로드 (공개)', description: '공개 파일 다운로드' })
    @HttpCode(HttpStatus.OK)
    //#endregion
    async downloadSharedFile(
        @Req() req: JwtUserRequest,
        @Res({ passthrough: true }) res: Response,
        @I18n() i18n: I18nContext,
        @Param('uid') uid: string
    ) {
        // console.log(uid);
        const fileData = await this.fileService.getSharedFile(uid);

        console.log(fileData);

        const fileSize = fileData.buffer.length;
        const range = res.req.headers.range;

        if (range) {
            const parts = range.replace(/bytes=/, '').split('-');
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            const chunksize = (end - start) + 1;


            const chunk = fileData.buffer.subarray(start, end + 1);

            res.status(HttpStatus.PARTIAL_CONTENT);
            res.header('Content-Range', `bytes ${start}-${end}/${fileSize}`);
            res.header('Accept-Ranges', 'bytes');
            res.header('Content-Length', chunksize.toString());
            res.header('Content-Type', fileData.mimetype);
            res.header('Content-Disposition' , `attachment;filename="${fileData.filename}"`)

            return new StreamableFile(chunk);
        } else {
            res.status(HttpStatus.OK); // 200 OK
            res.header('Content-Length', fileSize.toString());
            res.header('Content-Type', fileData.mimetype);
            res.header('Content-Disposition' , `attachment;filename="${fileData.filename}"`)

            return new StreamableFile(fileData.buffer);
        }
    }

    //#endregion FILE DOWNLOAD



    //#region FILE REMOVE

    @Delete(':uid')
    //#region Decorator
    @ApiOperation({ summary: '파일 삭제 ', description: '파일 삭제' })
    @ApiBearerAuth('token')
    @HttpCode(HttpStatus.OK)
    @UseGuards(CrepenAuthJwtGuard.whitelist('access_token'))
    //#endregion
    async removeFile(
        @Req() req: JwtUserRequest,
        // @Res() res: Response,
        @I18n() i18n: I18nContext,
        @Param('uid') uid: string
    ) {
        console.log("REMOVE FILE", uid);

        // throw CrepenFileError.FILE_NOT_FOUND;
        const removeFileRequest = await this.fileService.removeFile(uid, req.user.entity.uid);

        console.log('SUCCESS');

        return BaseResponse.ok(
            undefined,
            HttpStatus.OK,
            i18n.t('common.SUCCESS')
        )
    }


    //#endregion FILE REMOVE


    //#region FILE EDIT

    @Post(':uid')
    //#region Decorator
    @ApiOperation({ summary: '파일 수정 ', description: '파일 수정' })
    @ApiBearerAuth('token')
    @HttpCode(HttpStatus.OK)
    @UseGuards(CrepenAuthJwtGuard.whitelist('access_token'))
    //#endregion
    async editFileInfo(
        @Req() req: JwtUserRequest,
        @I18n() i18n: I18nContext,
        @Param('uid') uid: string,
        @Body() bodyData : EditFileDto
    ) {
        console.log("CHANGE FILE", uid , bodyData);

        // throw CrepenFileError.FILE_NOT_FOUND;
        // const removeFileRequest = await this.fileService.removeFile(uid, req.user.entity.uid);

        const editEntity = new FileEntity();
        editEntity.fileTitle = bodyData.fileTitle;
        editEntity.isShared = bodyData.isShared;

        await this.fileService.editFile(uid , editEntity, req.user.entity.uid );


        return BaseResponse.ok(
            undefined,
            HttpStatus.OK,
            i18n.t('common.SUCCESS')
        )
    }

    //#endregion FILE EDIT





    //#region  DEPRECATED


    // @Get('info')
    // //#region Decorator
    // @ApiOperation({ summary: '파일 조회', description: '파일 정보 조회' })
    // @ApiBearerAuth('token')
    // @HttpCode(HttpStatus.OK)
    // @UseGuards(CrepenAuthJwtGuard.whitelist('access_token'))
    // //#endregion
    // async getFileInfo(
    //     @Req() req: JwtUserRequest,
    //     @I18n() i18n: I18nContext,
    //     @Query('uid') uid?: string,
    // ) {
    //     if (StringUtil.isEmpty(uid)) {
    //         throw new CrepenLocaleHttpException('cloud_file', 'FILE_LOAD_INFO_UID_NOT_FOUND', HttpStatus.BAD_REQUEST);
    //     }

    //     const targetFileData = await this.fileService.getFileInfo(uid);

    //     if (ObjectUtil.isNullOrUndefined(targetFileData)) {
    //         throw new CrepenLocaleHttpException('cloud_file', 'FILE_NOT_FOUND', HttpStatus.NOT_FOUND);
    //     }
    //     else if (targetFileData.ownerUid !== req.user.entity.uid) {
    //         throw new CrepenLocaleHttpException('cloud_file', 'FILE_UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
    //     }


    //     return BaseResponse.ok(
    //         targetFileData,
    //         HttpStatus.OK,
    //         i18n.t('cloud_file.FILE_COMMON_SUCCESS')
    //     );
    // }

    //#endregion DEPRECATED

















}