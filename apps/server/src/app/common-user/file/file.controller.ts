import { Controller, Get, HttpCode, HttpStatus, Query, Req, UseGuards } from "@nestjs/common";
import { ApiTags, ApiHeader, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { CrepenFileRouteService } from "./file.service";
import { CrepenAuthJwtGuard } from "@crepen-nest/config/passport/jwt/jwt.guard";
import { JwtUserRequest } from "@crepen-nest/interface/jwt";
import { I18n, I18nContext } from "nestjs-i18n";
import { BaseResponse } from "@crepen-nest/lib/util/base.response";
import { StringUtil } from "@crepen-nest/lib/util/string.util";
import { CrepenLocaleHttpException } from "@crepen-nest/lib/exception/crepen.http.exception";
import { ObjectUtil } from "@crepen-nest/lib/util/object.util";

@ApiTags('[Common] 사용자 파일 관리 컨트롤러')
@ApiHeader({
    name: 'Accept-Language', required: false, enum: ['en', 'ko']
})
@Controller('explorer/file')
export class CrepenFileRouteController {
    constructor(
        private readonly fileService: CrepenFileRouteService
    ) { }

    @Get()
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
        else if(targetFileData.ownerUid !== req.user.entity.uid){
            throw new CrepenLocaleHttpException('cloud_file' , 'FILE_UNAUTHORIZED' , HttpStatus.UNAUTHORIZED);
        }


        return BaseResponse.ok(
            targetFileData,
            HttpStatus.OK,
            i18n.t('cloud_file.FILE_COMMON_SUCCESS')
        );
    }
}