import { CommonError } from "@crepen-nest/lib/error/common.error";

export class CheckDatabaseConnectionError extends CommonError{
     constructor(){
        super (
            'api_admin_setup.CHK_DB.FAILED',
            403,
            'CHK_DB.FAILED'
        )
    }
}