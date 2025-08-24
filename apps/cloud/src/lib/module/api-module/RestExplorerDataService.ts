import { TokenGroup } from "@web/lib/types/TokenGroup";
import { LocaleType } from "../locale/Locale";
import { FetchApi } from "../fetch/FetchApi";
import { BaseApiResultEntity } from "@web/lib/types/api/BaseApiResultEntity";
import { ExplorerAddFolderResult, ExplorerFileUploadResult, ExplorerFilterData, ExplorerFolderDataResult, ExplorerTreeEntity } from "@web/lib/types/api/dto/RestExplorerDto";
import * as humps from 'humps';
import { RestListResult, RestSearchFilterOptions } from "@web/lib/types/api/dto/RestCommonDto";
import urlJoin from "url-join";

export class RestExplorerDataService {
    constructor(token: TokenGroup | undefined, locale: LocaleType) {
        this.token = token;
        this.language = locale
    }

    token?: TokenGroup;
    language?: LocaleType;

    static current = (token: TokenGroup | undefined, locale: LocaleType) => {
        return new RestExplorerDataService(token, locale);
    }


    getChild = async (uid: string, searchFilterOptions?: RestSearchFilterOptions) => {
        const apiUrl = urlJoin(
            '/explorer',
            uid,
            isNaN(Number(searchFilterOptions?.page)) ? '' : `?page=${searchFilterOptions?.page?.toString()}`,
            isNaN(Number(searchFilterOptions?.pageSize)) ? '' : `?pageSize=${searchFilterOptions?.pageSize?.toString()}`,
            !searchFilterOptions?.sortCategory ? '' : `?sortCategory=${searchFilterOptions?.sortCategory?.toString()}`,
            !searchFilterOptions?.sortType ? '' : `?sortType=${searchFilterOptions?.sortType?.toString()}`,
            !searchFilterOptions?.keyword ? '' : `?keyword=${searchFilterOptions.keyword.toString()}`
        )

        const result = await FetchApi
            .instance(process.env.API_URL)
            .setMethod('GET')
            .setUrl(apiUrl)
            .setOptions({
                language: this.language,
                token: this.token?.accessToken
            })
            .getResponse();

        const resultData: BaseApiResultEntity<RestListResult<ExplorerTreeEntity>>
            = humps.camelizeKeys(Object.assign(result.jsonData ?? {})) as BaseApiResultEntity<RestListResult<ExplorerTreeEntity>>;

        return resultData
    }

    getFilterData = async () => {
        const result = await FetchApi
            .instance(process.env.API_URL)
            .setMethod('GET')
            .setUrl('/explorer/filter')
            .setOptions({
                language: this.language
            })
            .getResponse();

        const resultData: BaseApiResultEntity<ExplorerFilterData>
            = humps.camelizeKeys(Object.assign(result.jsonData ?? {})) as BaseApiResultEntity<ExplorerFilterData>

        return resultData;
    }


    /** @deprecated */
    uploadFile = async (file: File, parentFolderUid: string) => {

        throw new Error();

        const formData = new FormData();
        formData.set('file', file);

        const result = await FetchApi
            .instance(process.env.API_URL)
            .setMethod('PUT')
            .setUrl(`/explorer/folder/${parentFolderUid}/file/upload`)
            .setOptions({
                language: this.language,
                token: this.token?.accessToken
            })
            .getResponse();

        const resultData: BaseApiResultEntity<ExplorerFileUploadResult>
            = humps.camelizeKeys(Object.assign(result.jsonData ?? {})) as BaseApiResultEntity<ExplorerFileUploadResult>;

        return resultData
    }


    addFolder = async (parentFolderUid: string, folderName: string) => {
        const result = await FetchApi
            .instance(process.env.API_URL)
            .setMethod('POST')
            .setUrl(`/explorer/folder/${parentFolderUid}/folder/add`)
            .setBody({
                folderName: folderName
            })
            .setOptions({
                language: this.language,
                token: this.token?.accessToken
            })
            .getResponse();

        const resultData: BaseApiResultEntity<ExplorerAddFolderResult>
            = humps.camelizeKeys(Object.assign(result.jsonData ?? {})) as BaseApiResultEntity<ExplorerAddFolderResult>;

        return resultData
    }


    getFolderData = async (folderUid: string) => {
        const result = await FetchApi
            .instance(process.env.API_URL)
            .setMethod('GET')
            .setUrl(`/explorer/folder/${folderUid}`)
            .setOptions({
                language: this.language,
                token: this.token?.accessToken
            })
            .getResponse();

        const resultData: BaseApiResultEntity<ExplorerFolderDataResult>
            = humps.camelizeKeys(Object.assign(result.jsonData ?? {})) as BaseApiResultEntity<ExplorerFolderDataResult>;

        return resultData
    }
}