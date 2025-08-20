import { Controller, Get, HttpCode, HttpStatus, Logger, Param, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CrepenExplorerFileService } from "./file.explorer.service";
import { CrepenExplorerFolderService } from "./folder.explorer.service";
import { CrepenLoggerService } from "../common/logger/logger.service";
import { BaseResponse } from "@crepen-nest/lib/common/base.response";
import { CrepenExplorerDefaultService } from "./explorer.service";
import { I18n, I18nContext } from "nestjs-i18n";
import { AuthJwtGuard } from "@crepen-nest/module/config/passport/jwt/jwt.guard";
import { AuthUser } from "@crepen-nest/lib/extensions/decorator/param/auth-user.param.decorator";
import { UserEntity } from "../common-user/user/entity/user.default.entity";
import { ObjectUtil, StringUtil } from "@crepen-nest/lib/util";
import { RepositoryPaginationResult } from "@crepen-nest/interface/repo";
import { ExplorerTreeEntity } from "./entity/tree.explorer.default.entity";
import * as humps from 'humps'
import { ExplorerSearchFilterData } from "./interface/explorer.object";
import { FolderNotFoundError } from "@crepen-nest/lib/error/api/explorer/not_found.folder.error";

@ApiTags('[EXPLORER] 탐색기 - 공통')
@ApiHeader({
    name: 'Accept-Language',
    required: false,
    enum: ['en', 'ko']
})
@Controller('explorer')
export class CrepenExplorerDefaultController {
    constructor(
        private readonly fileService: CrepenExplorerFileService,
        private readonly folderService: CrepenExplorerFolderService,
        private readonly explorerService: CrepenExplorerDefaultService,
        private readonly logService: CrepenLoggerService
    ) { }



    @Get('filter')
    async getFilter(
        @I18n() i18n: I18nContext,
    ) {
        const filterData = this.explorerService.getFilter();

        return BaseResponse.ok<ExplorerSearchFilterData>(
            filterData,
            HttpStatus.OK,
            i18n.t('common.SUCCESS')
        )
    }


    @Get(':uid')
    //#region Decorator
    @ApiOperation({ summary: 'TEST', description: 'TEST' })
    @ApiBearerAuth('token')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthJwtGuard.whitelist('access_token'))
    //#endregion
    async getChildItems(
        @I18n() i18n: I18nContext,
        @Param('uid') uid: string,
        @AuthUser() user: UserEntity | undefined,
        @Query('sortType') sortType?: string,
        @Query('sortCategory') sortCategory?: string,
        @Query('page') page?: number,
        @Query('pageSize') pageSize?: number,
        @Query('keyword') keyword?: string
    ) {

        Logger.log(`type : ${sortType} / category : ${sortCategory}` , '/explorer/[uid]')
        Logger.log(`page : ${page} / pageSize : ${pageSize}` , '/explorer/[uid]')
        Logger.log(`keyword : ${keyword}` , '/explorer/[uid]')

        const folderData = await this.folderService.getFolderDataByUid(uid);

        if(ObjectUtil.isNullOrUndefined(folderData) && uid.toLowerCase() !== 'root'){
            throw new FolderNotFoundError();
        }

        const applySortType = ['asc', 'desc'].find(x => x === sortType?.trim().toLowerCase())
            ? sortType.trim().toLowerCase() as 'asc' | 'desc'
            : 'desc'

        const filterData = this.explorerService.getFilter();

        const searchChildData = await this.explorerService.getTree(uid, user.uid, {
            sortCategory: sortCategory,
            sortType: applySortType,
            page: page > 0 ? page : filterData.pagination.defaultPage,
            pageSize: pageSize > 0 ? pageSize : filterData.pagination.defaultPageSize,
            keyword : keyword
        });

        return BaseResponse.ok<RepositoryPaginationResult<ExplorerTreeEntity>>(
            searchChildData,
            HttpStatus.OK,
            i18n.t('common.SUCCESS')
        )
    }



}