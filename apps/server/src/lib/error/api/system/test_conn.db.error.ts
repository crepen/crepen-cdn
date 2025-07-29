import { CommonError } from "../../common.error";

export class DatabaseTestConnectError extends CommonError {
    constructor() {
        super(
            'system_api.TEST_DB_CONN_FAILED',
            403,
            'TEST_DB_CONN_FAILED'
        )
    }
}