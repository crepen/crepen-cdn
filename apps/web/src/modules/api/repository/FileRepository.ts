import { CrepenFetchExtenstion } from "../common/api/CrepenFetchExtension";
import { FetchApi } from "../common/api/FetchApiService";
import { CommonApiOptions } from "../entity/CommonApi";
import { EditFileRequestProp } from "../entity/repository/FileRepository";
import * as humps from 'humps';

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
                    'Content-Type': 'application/json'
                })
                .getResponse();

            return CrepenFetchExtenstion.convertCrepenResult(result);
        }
        catch (e) {
            return CrepenFetchExtenstion.getDefaultErrorResult(e as Error);
        }
    }

    static editFileData = async (fileUid?: string, editData?: EditFileRequestProp, options?: CommonApiOptions) => {
        try {
            const snakeCaseBody = humps.decamelizeKeys(editData);

            const result = await FetchApi.instance()
                .setMethod('POST')
                .setUrl(`/explorer/file/${fileUid ?? 'ntf'}`)
                .setBody(snakeCaseBody)
                .setOptions({
                    token: options?.token,
                    language: options?.language
                })
                .setHeaders({
                    'Content-Type': 'application/json'
                })
                .getResponse();

            return CrepenFetchExtenstion.convertCrepenResult(result);
        }
        catch (e) {
            return CrepenFetchExtenstion.getDefaultErrorResult(e as Error);
        }
    }
}