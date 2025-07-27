import { CrepenFetchExtenstion } from "../common/api/CrepenFetchExtension";
import { FetchApi } from "../common/api/FetchApiService";
import { CommonApiOptions } from "../entity/CommonApi";
import { FolderResultEntity } from "../entity/repository/FolderRepository";

export class FolderRepository {
    static getRootFolder = async (options?: CommonApiOptions) => {
        try {
            const result = await FetchApi.instance()
                .setMethod('GET')
                .setUrl('/explorer/folder/root')
                .setOptions({
                    token: options?.token,
                    language: options?.language
                })
                .getResponse();

            return CrepenFetchExtenstion.convertCrepenResult(result);
        }
        catch (e) {
            return CrepenFetchExtenstion.getDefaultErrorResult(e as Error);
        }
    }

    static getFolderData = async (folderUid?: string, options?: CommonApiOptions & { includeChild?: boolean }) => {
        try {
            const result = await FetchApi.instance()
                .setMethod('GET')
                .setUrl(`/explorer/folder/${folderUid}${options?.includeChild === true ? '?child=true' : ''}`)
                .setOptions({
                    token: options?.token,
                    language: options?.language
                })
                .getResponse();

            return CrepenFetchExtenstion.convertCrepenResult<FolderResultEntity>(result);
        }
        catch (e) {
            return CrepenFetchExtenstion.getDefaultErrorResult<FolderResultEntity>(e as Error);
        }
    }

    static addFolder = async (parentFolderUid: string, folderTitle: string, options?: CommonApiOptions) => {
        try {
            const result = await FetchApi.instance()
                .setMethod('PUT')
                .setUrl(`/explorer/folder`)
                .setBody({
                    parentFolderUid : parentFolderUid,
                    folderTitle: folderTitle
                })
                .setOptions({
                    token: options?.token,
                    language: options?.language
                })
                .getResponse();

            return CrepenFetchExtenstion.convertCrepenResult(result);
        }
        catch (e) {
            return CrepenFetchExtenstion.getDefaultErrorResult(e as Error);
        }
    }
}