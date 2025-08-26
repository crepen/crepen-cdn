import { BaseResponse } from "@crepen-nest/lib/common/base.response";
import { CrepenCommonHttpLocaleError } from "@crepen-nest/lib/error-bak/http/common.http.error";
import { StringUtil, ObjectUtil } from "@crepen-nest/lib/util";
import { AuthJwtGuard } from "@crepen-nest/module/config/passport/jwt/jwt.guard";
import { Controller, Get, HttpCode, HttpStatus, UseGuards, Req, Param, Query, Post, Body, Put, Delete } from "@nestjs/common";
import { ApiTags, ApiHeader, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { I18n, I18nContext } from "nestjs-i18n";
import { JwtUserRequest } from "src/interface/jwt";
import { CrepenFileRouteService } from "../file/file.service";
import { AddFolderDto } from "./dto/add.folder.dto";
import { EditFolderDto } from "./dto/edit.folder.dto";
import { LoadFolderDataWithChildResponseDto } from "./dto/folder.dto";
import { FolderEntity } from "./entity/folder.entity";
import { CrepenFolderError } from "./exception/folder.exception";
import { CrepenFolderRouteService } from "./folder.service";
import { AuthUser } from "@crepen-nest/lib/extensions/decorator/param/auth-user.param.decorator";
import { UserEntity } from "../user/entity/user.entity";


@ApiTags('[COMMON_USER] 사용자 폴더 관리 컨트롤러')
@ApiHeader({
    name: 'Accept-Language', required: false, enum: ['en', 'ko']
})
@Controller('explorer/folder/bak')
export class CrepenFolderRouteController {
    constructor(
        private readonly folderService: CrepenFolderRouteService,
        private readonly fileService: CrepenFileRouteService
    ) { }

    @Get('root')
    //#region Decorator
    @ApiOperation({
        summary: '사용자 최상위 폴더 조회',
        description: ' 로그인된 사용자의 최상위 폴더 정보 조회 <br />(최상위 폴더가 없을 시 생성 후 해당 정보 출력)'

    })
    @ApiBearerAuth('token')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthJwtGuard.whitelist('access_token'))
    //#endregion
    async getRootFolder(
        @Req() req: JwtUserRequest,
        @I18n() i18n: I18nContext,
        @AuthUser() user: UserEntity | undefined

    ) {
        const rootFolder = await this.folderService.getRootFolder(user?.uid)
        return BaseResponse.ok<FolderEntity>(
            rootFolder,
            HttpStatus.OK,
            i18n.t('cloud_folder.FOLDER_COMMON_SUCCESS')
        )
    }


    @Get(':uid')
    //#region Decorator
    @ApiOperation({ summary: '사용자 폴더 조회', description: '로그인된 사용자의 특정 폴더 정보 조회' })
    @ApiBearerAuth('token')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthJwtGuard.whitelist('access_token'))
    //#endregion
    async getFolderData(
        @Req() req: JwtUserRequest,
        @I18n() i18n: I18nContext,
        @Param('uid') uid: string,
        @Query('child') isLoadChild?: boolean
    ) {
        if (StringUtil.isEmpty(uid)) {
            throw CrepenFolderError.FOLDER_UID_UNDEFINED;
        }

        let targetData: FolderEntity = undefined;

        if (isLoadChild) {
            targetData = await this.folderService.getFolderDataWithChild(uid);
        }
        else {
            targetData = await this.folderService.getFolderData(uid);
        }

        if (targetData === null) {
            throw CrepenFolderError.FOLDER_NOT_FOUND;
        }

        return BaseResponse.ok(
            targetData,
            HttpStatus.OK,
            i18n.t('common.SUCCESS')
        )
    }


    @Post()
    //#region Decorator
    @ApiOperation({ summary: '사용자 폴더 수정', description: '폴더 수정' })
    @ApiBearerAuth('token')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthJwtGuard.whitelist('access_token'))
    //#endregion
    async editFolder(
        @Req() req: JwtUserRequest,
        @I18n() i18n: I18nContext,
        @Query('uid') uid?: string,
        @Body() bodyData?: EditFolderDto
    ) {

        const entity = new FolderEntity();
        entity.folderTitle = bodyData.folderTitle;

        const editFolderResult = await this.folderService.editFolderData(uid, entity)

        return BaseResponse.ok(
            bodyData,
            HttpStatus.OK,
            i18n.t('common.SUCCESS')
        )
    }





    /** @deprecated */
    @Get('backup-1')
    //#region Decorator
    @ApiOperation({ summary: '사용자 폴더 조회', description: '로그인된 사용자의 특정 폴더 정보 조회' })
    @ApiBearerAuth('token')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthJwtGuard.whitelist('access_token'))
    //#endregion
    async getFolderInfo(
        @Req() req: JwtUserRequest,
        @I18n() i18n: I18nContext,
        @AuthUser() user : UserEntity | undefined,
        @Query('uid') uid?: string,
        @Query('child') isLoadChild?: boolean,

    ) {

        if (StringUtil.isEmpty(uid)) {
            throw new CrepenCommonHttpLocaleError('cloud_folder', 'FOLDER_LOAD_FOLDER_UID_UNDEFINED', HttpStatus.BAD_REQUEST);
        }

        const targetFolderData = await this.folderService.getFolderData(uid);

        if (targetFolderData === null) {
            throw new CrepenCommonHttpLocaleError('cloud_folder', 'FOLDER_LOAD_FOLDER_TARGET_NOT_FOUND', HttpStatus.BAD_REQUEST);
        }

        if (targetFolderData.ownerUid !== user?.uid) {
            throw new CrepenCommonHttpLocaleError('cloud_folder', 'FOLDER_LOAD_UNAUTHORIZED', HttpStatus.UNAUTHORIZED)
        }

        const childList: FolderEntity[] = [];

        if (isLoadChild === true) {
            const childData = await this.folderService.getChildFolder(uid);

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




    @Put()
    //#region Decorator
    @ApiOperation({
        summary: '폴더 생성'
    })
    @ApiBearerAuth('token')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthJwtGuard.whitelist('access_token'))
    //#endregion
    async appendFolder(
        @Req() req: JwtUserRequest,
        @I18n() i18n: I18nContext,
        @Body() bodyData: AddFolderDto,
        @AuthUser() user : UserEntity | undefined
    ) {
        // console.log(bodyData)
        const newFolderUid = await this.folderService.appendChildFolder(bodyData.parentFolderUid, bodyData.folderTitle, user?.uid);

        return BaseResponse.ok(
            newFolderUid,
            HttpStatus.OK,
            i18n.t('common.SUCCESS')
        )
    }


    @Get('files')
    async getFolderFile(
        @Req() req: JwtUserRequest,
        @I18n() i18n: I18nContext,
        @Query('uid') uid?: string
    ) {
        if (StringUtil.isEmpty(uid)) {
            throw new CrepenCommonHttpLocaleError('cloud_folder', 'FOLDER_LOAD_FOLDER_UID_UNDEFINED', HttpStatus.BAD_REQUEST);
        }


        const folderData = await this.folderService.getFolderData(uid);

        if (ObjectUtil.isNullOrUndefined(folderData)) {
            throw new CrepenCommonHttpLocaleError('cloud_folder', 'FOLDER_LOAD_FOLDER_TARGET_NOT_FOUND', HttpStatus.NOT_FOUND);
        }

        const fileList = await this.fileService.getFolderFiles(folderData.uid);


        return BaseResponse.ok(
            fileList,
            HttpStatus.OK,
            i18n.t('common.SUCCESS')
        )
    }



    @Delete(':uid')
    //#region Decorator
    @ApiOperation({ summary: '폴더 삭제 ', description: '폴더 삭제' })
    @ApiBearerAuth('token')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthJwtGuard.whitelist('access_token'))
    //#endregion
    async removeFolder(
        @Req() req: JwtUserRequest,
        // @Res() res: Response,
        @I18n() i18n: I18nContext,
        @Param('uid') uid: string,
        @AuthUser() user : UserEntity | undefined
    ) {
        await this.folderService.removeFolderData(uid, user?.uid);

        return BaseResponse.ok(
            undefined,
            HttpStatus.OK,
            i18n.t('common.SUCCESS')
        )
    }



}