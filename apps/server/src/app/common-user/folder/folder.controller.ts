import { CrepenAuthJwtGuard } from "@crepen-nest/config/passport/jwt/jwt.guard";
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { CrepenFolderRouteService } from "./folder.service";
import { BaseResponse } from "@crepen-nest/lib/util/base.response";
import { I18n, I18nContext } from "nestjs-i18n";
import { StringUtil } from "@crepen-nest/lib/util/string.util";
import { CrepenLocaleHttpException } from "@crepen-nest/lib/exception/crepen.http.exception";
import { JwtUserRequest } from "@crepen-nest/interface/jwt";
import { LoadFolderDataResponseDto, LoadFolderDataWithChildResponseDto } from "./dto/folder.dto";
import { AddFolderDto } from "./dto/add.folder.dto";
import { FolderEntity } from "./entity/folder.entity";

@ApiTags('[Common] 사용자 파일/폴더 관리 컨트롤러')
@ApiHeader({
    name: 'Accept-Language', required: false, enum: ['en', 'ko']
})
@Controller('explorer/folder')
export class CrepenFolderRouteController {
    constructor(
        private readonly explorerService: CrepenFolderRouteService
    ) { }


    @Get()
    //#region Decorator
    @ApiOperation({ summary: '사용자 폴더 조회', description: '로그인된 사용자의 특정 폴더 정보 조회' })
    @ApiBearerAuth('token')
    @HttpCode(HttpStatus.OK)
    @UseGuards(CrepenAuthJwtGuard.whitelist('access_token'))
    //#endregion
    async getFolderInfo(
        @Req() req: JwtUserRequest,
        @I18n() i18n: I18nContext,
        @Query('uid') uid?: string,
        @Query('child') isLoadChild?: boolean
    ) {

        if (StringUtil.isEmpty(uid)) {
            throw new CrepenLocaleHttpException('cloud_folder', 'FOLDER_LOAD_FOLDER_UID_UNDEFINED', HttpStatus.BAD_REQUEST);
        }

        const targetFolderData = await this.explorerService.getFolderData(uid);

        if (targetFolderData === null) {
            throw new CrepenLocaleHttpException('cloud_folder', 'FOLDER_LOAD_FOLDER_TARGET_NOT_FOUND', HttpStatus.BAD_REQUEST);
        }

        if (targetFolderData.ownerUid !== req.user.entity.uid) {
            throw new CrepenLocaleHttpException('cloud_folder', 'FOLDER_LOAD_UNAUTHORIZED', HttpStatus.UNAUTHORIZED)
        }

        const childList: FolderEntity[] = [];

        if (isLoadChild === true) {
            const childData = await this.explorerService.getChildFolder(uid);

            if (childData.length > 0) {
                childList.push(...childData);
            }
        }


        return BaseResponse.ok<LoadFolderDataWithChildResponseDto>(
            {
                info: targetFolderData,
                children: isLoadChild === false ? undefined : {
                    folder: childList
                }
            },
            HttpStatus.OK,
            i18n.t('cloud_folder.FOLDER_COMMON_SUCCESS')
        )
    }


    @Get('root')
    //#region Decorator
    @ApiOperation({
        summary: '사용자 최상위 폴더 조회',
        description: ' 로그인된 사용자의 최상위 폴더 정보 조회 <br />(최상위 폴더가 없을 시 생성 후 해당 정보 출력)'

    })
    @ApiBearerAuth('token')
    @HttpCode(HttpStatus.OK)
    @UseGuards(CrepenAuthJwtGuard.whitelist('access_token'))
    //#endregion
    async getRootFolder(
        @Req() req: JwtUserRequest,
        @I18n() i18n: I18nContext,

    ) {
        const rootFolder = await this.explorerService.getRootFolder(req.user.entity.uid)
        return BaseResponse.ok<FolderEntity>(
            rootFolder,
            HttpStatus.OK,
            i18n.t('cloud_folder.FOLDER_COMMON_SUCCESS')
        )
    }

    @Put()
    //#region Decorator
    @ApiOperation({
        summary: '폴더 생성'
    })
    @ApiBearerAuth('token')
    @HttpCode(HttpStatus.OK)
    @UseGuards(CrepenAuthJwtGuard.whitelist('access_token'))
    //#endregion
    async appendFolder(
        @Req() req: JwtUserRequest,
        @I18n() i18n: I18nContext,
        @Body() bodyData: AddFolderDto
    ) {
        // console.log(bodyData)
        await this.explorerService.appendChildFolder(bodyData.parentFolderUid, bodyData.folderTitle, req.user.entity.uid);

        return BaseResponse.ok(
            undefined,
            HttpStatus.OK,
            i18n.t('cloud_folder.FOLDER_COMMON_SUCCESS')
        )
    }




}