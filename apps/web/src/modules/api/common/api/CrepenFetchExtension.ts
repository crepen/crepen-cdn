import { CrepenApiResult } from '@web/modules/common-1/result/CrepenApiResult';
import { CrepenApiError } from '@web/modules/crepen/error/api/CrepenApiError';
import * as humps from 'humps';
import { FetchApiResult } from './FetchApiService';


export class CrepenFetchExtenstion {
    static convertCrepenResult = <T = unknown | undefined>(result: FetchApiResult): CrepenApiResult<T> => {

        if (Object.keys(result.jsonData ?? {}).indexOf('success') === -1) {
            throw CrepenApiError.CREPEN_RESULT_UNMATCH;
        }

        const resultObj = humps.camelizeKeys(Object.assign(result.jsonData ?? {}))


        return new CrepenApiResult<T>({
            success: resultObj.success,
            data: (resultObj.data ?? undefined) as T | undefined,
            errorCode: resultObj.errorCode,
            message: resultObj.message,
            statusCode: resultObj.statusCode
        })
    }

    static getDefaultErrorResult = <T = unknown | undefined>(e?: Error): CrepenApiResult<T> => {
        return new CrepenApiResult<T>({
            success: false,
            message: 'Unknown Error',
            errorCode: 'SYSTE_UNKNOWN_ERROR',
            innerError: e,
            statusCode: 500
        })
    }
}