import { CommonError } from "../../common.error";

export class DatabaseConnectError extends CommonError {
    constructor() {
        super(
            'server_system.SYSTEM_DEFAULT_DB_CONNECT_FAILED',
            503,
            'SYSTEM_DEFAULT_DB_CONNECT_FAILED'
        )
    }
}