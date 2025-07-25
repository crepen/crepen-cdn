import { CrepenServiceResult } from "@web/modules/common-1/result/CrepenServiceResult"

export class CommonOperationService {

    static getDefaultUnkownResult = <T = unknown>(e: Error): CrepenServiceResult<T> => {

         return new CrepenServiceResult<T>({
                success: false,
                message: 'Unknown Error',
                errorCode: 'SYSTE_UNKNOWN_ERROR',
                innerError: e,
                statusCode: 500
            });
    }
}