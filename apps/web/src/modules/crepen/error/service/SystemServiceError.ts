import { BaseErrorOptions, BaseServiceError } from "./BaseServiceError";

export class SystemServiceError extends BaseServiceError{
    constructor(message : string , options? : BaseErrorOptions){
        super(message , options);
    }


    static TRY_DATABASE_CONN_FAILED = (apiMessage? : string) => new SystemServiceError('Connect Failed' , {
        apiMessage : apiMessage
    })
}