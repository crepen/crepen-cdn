import { Controller, Get, Header, HttpCode, HttpStatus, Options, Param, Post, Put, Query, Req, Res, StreamableFile, UploadedFile, UseFilters, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CrepenLoggerService } from "../common/logger/logger.service";
import { CrepenExplorerFolderService } from "./folder.explorer.service";
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
import { ExplorerFileEntity } from "./entity/file.explorer.default.entity";
import { FileNotFoundError } from "@crepen-nest/lib/error/api/explorer/not_found_file.error";
import * as path from 'path';
import * as fs from 'fs';
import * as express from 'express';
import { ExceptionResultFactory } from "@crepen-nest/lib/extensions/filter/common.exception.filter";
import { CrepenExplorerFileService } from "./services/file.explorer.service";
import { CrepenExplorerEncryptFileService } from "./services/encrypt-file.explorer.service";
import { DownloadUnknownError } from "@crepen-nest/lib/error/api/explorer/unknown_download_failed.file.error";
import { CommonError } from "@crepen-nest/lib/error/common.error";
import Stream, { Readable } from "stream";
import { IgnorePrematureCloseFilter } from "@crepen-nest/lib/extensions/filter/ignore-premature-clouse.exception.filter";
import { FileUpdatePublishedStateUndefinedError } from "@crepen-nest/lib/error/api/explorer/published_state_undefined.error";
import { CrepenExplorerFileEncryptQueueService } from "./services/file-queue.service";
import { ExplorerFileQueueType } from "./enum/file-queue-type.enum";
import { ExplorerFileQueueState } from "./enum/file-queue-state.enum";
import { FileCryptingAlreadyRunningError } from "@crepen-nest/lib/error/api/explorer/file_already_crypt.file.error";
import { DatabaseService } from "@crepen-nest/app/config/database/database.config.service";
import { DynamicConfigService } from "@crepen-nest/app/config/dynamic-config/dynamic-config.service";
import { AuthJwtGuard } from "@crepen-nest/app/config/passport/jwt/jwt.guard";

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
        private readonly dynamicConfig: DynamicConfigService,
        private readonly encryptFileService: CrepenExplorerEncryptFileService,
        private readonly fileQueueService: CrepenExplorerFileEncryptQueueService,
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


            const fileInfo: ExplorerFileEntity = await this.fileService.getFileDataByUid(uid);

            return BaseResponse.ok(
                fileInfo,
                HttpStatus.OK,
                i18n.t('common.SUCCESS')
            )
        })
    }


    @Post(':uid/publish')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthJwtGuard.whitelist(TokenTypeEnum.ACCESS_TOKEN))
    async updateFilePublish(
        @Req() req: Request,
        @I18n() i18n: I18nContext,
        @AuthUser() user: UserEntity,
        @Param('uid') uid: string,
        @Query('state') updatePublishState: boolean
    ) {
        return (await this.databaseService.getDefault()).transaction(async (manager) => {

            if (updatePublishState === undefined) {
                throw new FileUpdatePublishedStateUndefinedError();
            }

            void await this.fileService.updateFilePublished(uid, updatePublishState);

            return BaseResponse.ok(
                undefined,
                HttpStatus.OK,
                i18n.t('common.SUCCESS')
            )
        })
    }




    @Post(':uid/crypt')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthJwtGuard.whitelist(TokenTypeEnum.ACCESS_TOKEN))
    async updateFileCrypt(
        @Req() req: Request,
        @I18n() i18n: I18nContext,
        @AuthUser() user: UserEntity,
        @Param('uid') uid: string,
        @Query('state') updateCryptState: boolean
    ) {
        return (await this.databaseService.getDefault()).transaction(async (manager) => {



            const fileInfo = await this.fileService.getFileDataByUid(uid, { manager: manager });
            const queueList = await this.fileQueueService.getQueueList([ExplorerFileQueueState.WAIT, ExplorerFileQueueState.RUNNING], { manager: manager });

            const isEncrypt = (fileInfo.encryptedFiles ?? []).length > 0;
            const isRunning = queueList.find(x => x.fileUid === uid) !== undefined;

            if (isRunning) {
                throw new FileCryptingAlreadyRunningError();
            }
            else if (updateCryptState === isEncrypt || updateCryptState === undefined) {/** EMPTY */ }
            else {
                const changeType =
                    updateCryptState === true
                        ? ExplorerFileQueueType.ENCRYPT
                        : updateCryptState === false
                            ? ExplorerFileQueueType.DECRYPT
                            : undefined

                void await this.fileQueueService.addQueue(uid, changeType, user.uid, { manager: manager })
            }

            return BaseResponse.ok(
                undefined,
                HttpStatus.OK,
                i18n.t('common.SUCCESS')
            )
        })
    }




    @Get('download/:filename')
    @HttpCode(HttpStatus.OK)
    @Header('Content-Type', 'application/octet-stream')
    @UseGuards(AuthJwtGuard.whitelist(TokenTypeEnum.ACCESS_TOKEN))
    async downloadFile(
        @Req() req: express.Request,
        @Res({ passthrough: false }) res: express.Response,
        @I18n() i18n: I18nContext,
        @AuthUser() user: UserEntity,
        @Param('filename') fileName: string,
    ) {
        try {
            return (await this.databaseService.getDefault()).transaction(async (manager) => {
                // const fileInfo = await this.fileService.getFileDataByFileName(fileName, { manager: manager });

                // if (!fileInfo) {
                //     throw new FileNotFoundError();
                // }

                const fileIncludeEncryptData = await this.encryptFileService.getFileIncludeEncryptDataByFileName(fileName.trim());


                if (!fileIncludeEncryptData) {
                    throw new FileNotFoundError();
                }




                let filePath: string | undefined = undefined;

                if (fileIncludeEncryptData.encryptedFiles.length > 0) {


                    filePath = path.join(
                        this.dynamicConfig.get('path.data'),
                        'file',
                        fileIncludeEncryptData.filePath,
                        fileIncludeEncryptData.encryptedFiles[0].fileName
                    );

                }
                else {
                    filePath = path.join(
                        this.dynamicConfig.get('path.data'),
                        'file',
                        fileIncludeEncryptData.filePath,
                        fileIncludeEncryptData.storeFileName
                    );
                }

                if (!fs.existsSync(filePath)) {
                    throw new FileNotFoundError();
                }


                // const key = globalSecret.length < 32 ? globalSecret.padEnd(32, '-') : globalSecret.slice(0, 32);
                // const decipher = crypto.createDecipheriv('aes-256-cbc', key, fileInfo.fileEncIv);

                // Range 헤더 확인
                const range = res.req.headers.range;
                const fileSize = fileIncludeEncryptData?.fileSize;

                res.setHeader('Content-Type', fileIncludeEncryptData.fileMimeType || 'application/octet-stream');
                res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileIncludeEncryptData.fileName)}"`);

                let streamFile: Readable;

                if (range && fileIncludeEncryptData.encryptedFiles.length === 0) {
                    const CHUNK_SIZE_LIMIT = 1024 * 1024 * 10;

                    const parts = range.replace(/bytes=/, '').split('-');
                    const startByte = parseInt(parts[0], 10);
                    const endByte = parts[1]
                        ? Math.min(parseInt(parts[1], 10), fileSize - 1)
                        : Math.min(startByte + CHUNK_SIZE_LIMIT - 1, fileSize - 1);

                    const chunkSize = (endByte - startByte) + 1;

                    res.status(HttpStatus.PARTIAL_CONTENT);
                    res.setHeader('Content-Range', `bytes ${startByte}-${endByte}/${fileSize}`);
                    res.setHeader('Accept-Ranges', 'bytes');
                    res.setHeader('Content-Length', chunkSize);

                    streamFile = fs.createReadStream(filePath, {
                        start: startByte,
                        end: endByte
                    })
                }
                else {
                    res.status(HttpStatus.OK);
                    res.setHeader('Content-Length', fileIncludeEncryptData.fileSize);
                    res.setHeader('Accept-Ranges', 'none');



                    if (fileIncludeEncryptData.encryptedFiles.length > 0) {
                        const globalSecret = this.dynamicConfig.get<string>('secret');
                        streamFile = await this.fileService.getDecryptFileStream(filePath, globalSecret);
                    }
                    else {
                        const readFileStream = fs.createReadStream(filePath);
                        streamFile = readFileStream;
                    }


                }

                streamFile
                    .pipe(res);
            })
        }
        catch (e) {
            let castError = new DownloadUnknownError();

            if (e instanceof CommonError) {
                castError = e;
            }

            ExceptionResultFactory.current(res, i18n, castError)
                .sendResponse();
        }

    }




    @Get('download/publish/:filename')
    @HttpCode(HttpStatus.OK)
    @Header('Content-Type', 'application/octet-stream')
    @UseFilters(IgnorePrematureCloseFilter)
    async downloadPublishedFile(
        @Req() req: express.Request,
        @Res() res: express.Response,
        @I18n() i18n: I18nContext,
        @AuthUser() user: UserEntity,
        @Param('filename') fileName: string,
    ) {
        try {
            return (await this.databaseService.getDefault()).transaction(async (manager) => {

                res.header('Access-Control-Allow-Origin', '*');
                res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
                res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Range');

                const fileInfo = await this.fileService.getFileDataByFileName(fileName.trim(), { manager: manager });

                if (!fileInfo) {
                    throw new FileNotFoundError();
                }
                else if (!fileInfo.isPublished) {
                    throw new FileNotFoundError();
                }


                let filePath: string | undefined = undefined;

                if (fileInfo.encryptedFiles.length > 0) {

                    filePath = path.join(
                        this.dynamicConfig.get('path.data'),
                        'file',
                        fileInfo.filePath,
                        fileInfo.encryptedFiles[0].fileName
                    );

                }
                else {
                    filePath = path.join(
                        this.dynamicConfig.get('path.data'),
                        'file',
                        fileInfo.filePath,
                        fileInfo.storeFileName
                    );
                }

                if (!fs.existsSync(filePath)) {
                    throw new FileNotFoundError();
                }

                // Range 헤더 확인
                const range = res.req.headers.range;
                const fileSize = fileInfo?.fileSize;

                res.setHeader('Content-Type', fileInfo.fileMimeType || 'application/octet-stream');
                res.setHeader('Content-Disposition', `filename="${encodeURIComponent(fileInfo.fileName)}"`);

                let streamFile: Readable;

                if (range && (fileInfo.encryptedFiles ?? []).length === 0) {
                    const CHUNK_SIZE_LIMIT = 1024 * 1024 * 10;

                    const parts = range.replace(/bytes=/, '').split('-');
                    const startByte = parseInt(parts[0], 10);
                    const endByte = parts[1]
                        ? Math.min(parseInt(parts[1], 10), fileSize - 1)
                        : Math.min(startByte + CHUNK_SIZE_LIMIT - 1, fileSize - 1);

                    const chunkSize = (endByte - startByte) + 1;

                    res.status(HttpStatus.PARTIAL_CONTENT);
                    res.setHeader('Content-Range', `bytes ${startByte}-${endByte}/${fileSize}`);
                    res.setHeader('Accept-Ranges', 'bytes');
                    res.setHeader('Content-Length', chunkSize);

                    streamFile = fs.createReadStream(filePath, {
                        start: startByte,
                        end: endByte
                    })
                }
                else {
                    res.status(HttpStatus.OK);
                    res.setHeader('Content-Length', fileInfo.fileSize);
                    res.setHeader('Accept-Ranges', 'none');



                    if (fileInfo.encryptedFiles.length > 0) {
                        const globalSecret = this.dynamicConfig.get<string>('secret');
                        streamFile = await this.fileService.getDecryptFileStream(filePath, globalSecret);
                    }
                    else {
                        const readFileStream = fs.createReadStream(filePath);
                        streamFile = readFileStream;
                    }


                }

                streamFile
                    .pipe(res);
            })
        }
        catch (e) {
            let castError = new DownloadUnknownError();

            if (e instanceof CommonError) {
                castError = e;
            }

            ExceptionResultFactory.current(res, i18n, castError)
                .sendResponse();
        }
    }


}