import { ApiError, BaseErrorCategory } from "./ApiError";

export class CommonApiError extends ApiError {
    constructor(category: BaseErrorCategory, message: string, options?: ErrorOptions) {
        super(category , message , options)
    }

    static BASE_URL_UNDEFINED = new ApiError('SYSTEM' , 'Base Url not defined.');
    static REQUEST_METHOD_UNDEFINED = new ApiError('SYSTEM' , 'Request method not defined.');
    static FETCH_CONN_FAILED = new ApiError('SYSTEM' , 'fetch failed.');
}