import { CrepenCommonHttpLocaleError, CrepenCommonHttpLocaleErrorOption } from "./common.http.error";


/** @deprecated */
export class CrepenServerSystemHttpError extends CrepenCommonHttpLocaleError{
    constructor(message : string , status : number , options? : CrepenCommonHttpLocaleErrorOption){
        super('server_system' , message ,status , options)
    }

    static SYSTEM_UNINIT = new CrepenServerSystemHttpError('SYSTEM_UNINIT' , 500);
    static SYSTEM_LOCAL_DB_CONNECT_FAILED = new CrepenServerSystemHttpError('SYSTEM_LOCAL_DB_CONNECT_FAILED' , 503)
}