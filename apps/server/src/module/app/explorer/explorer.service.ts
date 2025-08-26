import { Injectable } from "@nestjs/common";
import { CrepenExplorerRepository } from "./explorer.repository";
import { ExplorerTreeEntity } from "./entity/tree.explorer.default.entity";
import * as humps from 'humps';
import { SearchFilterParamOptions } from "@crepen-nest/interface/request-param";
import { I18nService } from "nestjs-i18n";
import { ExplorerSearchFilterData } from "./interface/explorer.object";
import { StringUtil } from "@crepen-nest/lib/util";
import { RepositoryOptions } from "@crepen-nest/interface/repo";
import { randomUUID } from "crypto";
import { ExplorerItemType } from "./enum/item-type.explorer.enum";

@Injectable()
export class CrepenExplorerDefaultService {
    constructor(
        private readonly explorerRepo: CrepenExplorerRepository,
        private readonly i18n: I18nService
    ) { }



    getTree = (targetUid?: string, ownerUid?: string, options?: SearchFilterParamOptions) => {



        const allowSortCategory = Object.keys(humps.decamelizeKeys(new ExplorerTreeEntity()));



        const applyFilterOption: SearchFilterParamOptions = {
            sortCategory: 'title',
            sortType: 'desc',
            page: 1,
            pageSize: 10,
            keyword: undefined
        }


        if (allowSortCategory.find(x => x === options.sortCategory)) {
            applyFilterOption.sortCategory = options.sortCategory;
            applyFilterOption.sortType = options.sortType;
        }

        if (!isNaN(Number(options.pageSize)) && !isNaN(Number(options.page))) {
            applyFilterOption.page = options.page;
            applyFilterOption.pageSize = options.pageSize;
        }

        applyFilterOption.keyword = StringUtil.isEmpty(options.keyword) ? undefined : options.keyword


        return this.explorerRepo.getChildTreeObject(targetUid ?? '', ownerUid ?? 'ntf', applyFilterOption);
    }

    getFilter = (): ExplorerSearchFilterData => {
        const keys = Object.keys(humps.decamelizeKeys(new ExplorerTreeEntity()))
            .filter(key =>
                key.toUpperCase() !== 'TARGET_UID' &&
                key.toUpperCase() !== 'CHILD_LINK_UID' &&
                key.toUpperCase() !== 'CHILD_TYPE' &&
                key.toUpperCase() !== 'OWNER_UID'
            )
            .map(key => ({
                key: key,
                text: this.i18n.t(`api_explorer.FILTER.LABEL.${key.toUpperCase()}`)
            }))

        return {
            sort: {
                category: keys,
                defaultCategory: {
                    key: 'update_date',
                    text: this.i18n.t(`api_explorer.FILTER.LABEL.UPDATE_DATE`)
                },
                defaultSortType: 'desc'
            },
            pagination: {
                defaultPage: 1,
                defaultPageSize: 20
            }
        };
    }


    getCatalog = async (userUid: string, options?: RepositoryOptions): Promise<string> => {
        const userCatalog = await this.explorerRepo.getCatalogFromUser(userUid, options);

        if ((userCatalog ?? []).length > 0) {
            return userCatalog[0].catalogUid;
        }

        const unfullCatalog = await this.explorerRepo.getUnfullCatalog(options)

        if (unfullCatalog) {
            const addCatalog = await this.explorerRepo.addCatalogLink(unfullCatalog, userUid, options);
            return addCatalog.catalogUid;
        }
        else {

            const addCatalog = await this.explorerRepo.addCatalogLink(randomUUID(), userUid, options);
            return addCatalog.catalogUid;
        }
    }


    linkObject = async (ownerUid: string, targetUid: string, childUid: string, type: ExplorerItemType, options?: RepositoryOptions) => {
       

        return this.explorerRepo.linkTree(ownerUid , targetUid , childUid , type , options);
    }


    linkFolder = async (ownerUid: string, targetFolderUid: string, childFolderUid: string, options?: RepositoryOptions) => {
        return this.linkObject(ownerUid, targetFolderUid, childFolderUid, ExplorerItemType.FOLDER, options)
    }

    linkFile = async (ownerUid: string, targetFolderUid: string, childFileUid: string, options?: RepositoryOptions) => {
        return this.linkObject(ownerUid, targetFolderUid, childFileUid, ExplorerItemType.FILE, options);
    }


   
}