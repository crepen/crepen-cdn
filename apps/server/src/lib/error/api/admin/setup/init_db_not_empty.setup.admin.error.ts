import { CommonError } from "@crepen-nest/lib/error/common.error";

export class InitDatabaseNotEmpty extends CommonError {
    constructor() {
        super(
            'api_admin_setup.CHK_DB.NOT_EMPTY',
            403,
            'CHK_DB.NOT_EMPTY'
        )
    }
}