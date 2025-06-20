import { Body, Controller, Get, HttpCode, HttpStatus, Put, Query, Req, Res, StreamableFile, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiTags, ApiHeader, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { CrepenFileRouteService } from "./file.service";
import { CrepenAuthJwtGuard } from "@crepen-nest/config/passport/jwt/jwt.guard";
import { JwtUserRequest } from "@crepen-nest/interface/jwt";
import { I18n, I18nContext } from "nestjs-i18n";
import { BaseResponse } from "@crepen-nest/lib/util/base.response";
import { StringUtil } from "@crepen-nest/lib/util/string.util";
import { CrepenLocaleHttpException } from "@crepen-nest/lib/exception/crepen.http.exception";
import { ObjectUtil } from "@crepen-nest/lib/util/object.util";
import { FileInterceptor } from "@nestjs/platform-express";
import { AddFileDto } from "./dto/file.dto";
import { CrepenFolderRouteService } from "../folder/folder.service";
import { Transaction } from "typeorm";
import { Response } from "express";
import { createReadStream } from "fs";

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

    @Get('info')
    //#region Decorator
    @ApiOperation({ summary: '파일 조회', description: '파일 정보 조회' })
    @ApiBearerAuth('token')
    @HttpCode(HttpStatus.OK)
    @UseGuards(CrepenAuthJwtGuard.whitelist('access_token'))
    //#endregion
    async getFileInfo(
        @Req() req: JwtUserRequest,
        @I18n() i18n: I18nContext,
        @Query('uid') uid?: string,
    ) {
        if (StringUtil.isEmpty(uid)) {
            throw new CrepenLocaleHttpException('cloud_file', 'FILE_LOAD_INFO_UID_NOT_FOUND', HttpStatus.BAD_REQUEST);
        }

        const targetFileData = await this.fileService.getFileInfo(uid);

        if (ObjectUtil.isNullOrUndefined(targetFileData)) {
            throw new CrepenLocaleHttpException('cloud_file', 'FILE_NOT_FOUND', HttpStatus.NOT_FOUND);
        }
        else if (targetFileData.ownerUid !== req.user.entity.uid) {
            throw new CrepenLocaleHttpException('cloud_file', 'FILE_UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
        }


        return BaseResponse.ok(
            targetFileData,
            HttpStatus.OK,
            i18n.t('cloud_file.FILE_COMMON_SUCCESS')
        );
    }

    @Get()
    //#region Decorator
    @ApiOperation({ summary: '파일 데이터 조회', description: '파일 데이터 조회' })
    @ApiBearerAuth('token')
    @HttpCode(HttpStatus.OK)
    @UseGuards(CrepenAuthJwtGuard.whitelist('access_token'))
    //#endregion
    async getFileData(
        @Req() req: JwtUserRequest,
        @Res() res: Response,
        @I18n() i18n: I18nContext,
        @Query('uid') uid?: string,
    ) {
        if (StringUtil.isEmpty(uid)) {
            throw new CrepenLocaleHttpException('cloud_file', 'FILE_LOAD_INFO_UID_NOT_FOUND', HttpStatus.BAD_REQUEST);
        }

        const fileData = await this.fileService.getFileData(uid, req.user.entity.uid);

        res.set({
            'Content-Type': fileData.mimetype,
            'Content-Length': fileData.size,
            'Content-Disposition': `attachment; filename=${fileData.originalname}`
        })
        res.send(fileData.buffer)
    }

    @Get('stream')
    //#region Decorator
    @ApiOperation({ summary: '파일 데이터 스트리밍 조회', description: '파일 데이터 조회' })
    @ApiBearerAuth('token')
    @HttpCode(HttpStatus.OK)
    @UseGuards(CrepenAuthJwtGuard.whitelist('access_token'))
    //#endregion
    async getFileDataStream(
        @Req() req: JwtUserRequest,
        @Res() res: Response,
        @I18n() i18n: I18nContext,
        @Query('uid') uid?: string,
    ) {
        if (StringUtil.isEmpty(uid)) {
            throw new CrepenLocaleHttpException('cloud_file', 'FILE_LOAD_INFO_UID_NOT_FOUND', HttpStatus.BAD_REQUEST);
        }

        const fileData = await this.fileService.getFileData(uid, req.user.entity.uid);

        return new StreamableFile(fileData.buffer , {
            disposition :`attachment; filename=${fileData.originalname}`,
            length : fileData.size,
            type : fileData.mimetype,
        })
        
    }

    @Put()
    //#region Decorator
    @ApiOperation({ summary: '파일 등록', description: '파일 정보 등록' })
    @ApiBearerAuth('token')
    @HttpCode(HttpStatus.OK)
    @UseGuards(CrepenAuthJwtGuard.whitelist('access_token'))
    @UseInterceptors(FileInterceptor('file'))
    //#endregion
    async addFile(
        @Req() req: JwtUserRequest,
        @I18n() i18n: I18nContext,
        @UploadedFile() file: Express.Multer.File,
        @Body() bodyData: AddFileDto
    ) {

        if (ObjectUtil.isNullOrUndefined(file)) {
            throw new CrepenLocaleHttpException('cloud_file', 'FILE_ADD_FAILED_FILE_UNDEFINED', HttpStatus.BAD_REQUEST);
        }

        const addFileData = await this.fileService.addFile(
            bodyData.fileTitle,
            file,
            bodyData.parentFolderUid,
            req.user.entity.uid,
            {
                shared: bodyData.optionShared
            }
        )

        return BaseResponse.ok(
            addFileData,
            HttpStatus.OK,
            i18n.t('cloud_file.FILE_COMMON_SUCCESS')
        );
    }
}