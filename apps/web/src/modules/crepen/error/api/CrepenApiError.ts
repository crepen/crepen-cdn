import { ApiError, BaseErrorCategory } from "./ApiError";

export class CrepenApiError extends ApiError {
    constructor(category: BaseErrorCategory, message: string, options?: ErrorOptions) {
        super(category , message , options)
    }

    static CREPEN_RESULT_UNMATCH = new CrepenApiError('SYSTEM' , 'Result type not matched.');
}