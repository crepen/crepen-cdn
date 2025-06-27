import { BaseServiceResult } from "./common.service";

/** @deprecated */
export class CrepenApiResponse<T = unknown> {
    data?: T;
    message?: string;
    success?: boolean;
    statusCode?: number;
    errorCode?: string;


    static toServiceResponse = <T = unknown>(response: CrepenApiResponse<T>): BaseServiceResult<T> => {
        const result = new BaseServiceResult<T>();
        result.data = response.data;
        result.success = response.success;
        result.message = response.message;
        result.statusCode = response.statusCode;
        result.errorCode = response.errorCode;

        return result;
    }
}


export class CrepenApiOptions {
    token?: string;
    language?: string;
}