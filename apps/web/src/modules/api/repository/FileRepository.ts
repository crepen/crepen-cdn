import { CrepenFetchExtenstion } from "../common/api/CrepenFetchExtension";
import { FetchApi } from "../common/api/FetchApiService";
import { CommonApiOptions } from "../entity/CommonApi";

export class FileRepository {
    static getFileInfo = async (fileUid?: string, options?: CommonApiOptions) => {
        try {
            const result = await FetchApi.instance()
                .setMethod('GET')
                .setUrl(`/explorer/file/${fileUid ?? 'ntf'}`)
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

    static removeFile = async (fileUid?: string, options?: CommonApiOptions) => {
        try {
            const result = await FetchApi.instance()
                .setMethod('DELETE')
                .setUrl(`/explorer/file/${fileUid ?? 'ntf'}`)
                .setOptions({
                    token: options?.token,
                    language: options?.language
                })
                .setHeaders({
                    'Content-Type' : 'application/json'
                })
                .getResponse();

            return CrepenFetchExtenstion.convertCrepenResult(result);
        }
        catch (e) {
            return CrepenFetchExtenstion.getDefaultErrorResult(e as Error);
        }
    }
}