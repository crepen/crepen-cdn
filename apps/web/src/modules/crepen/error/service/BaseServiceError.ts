import { BaseError } from "../BaseError";

export type BaseErrorOptions = ErrorOptions & {apiMessage?: string}

export class BaseServiceError extends BaseError {
    constructor(message : string , options? : BaseErrorOptions){

        super(message , options);
        this.apiMessage = options?.apiMessage;
    }

    apiMessage? : string
}