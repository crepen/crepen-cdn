import { Controller, HttpCode, HttpStatus, Param, Post, Put, Req, Res, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
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
        private readonly logService: CrepenLoggerService
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
                parentFolderUid : uid,
                fileSize : file.size
            },
            HttpStatus.OK,
            i18n.t('common.SUCCESS')
        )
    }
}