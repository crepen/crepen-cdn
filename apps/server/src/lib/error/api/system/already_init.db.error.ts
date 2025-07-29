import { CommonError } from "../../common.error";

export class PlatformAlreadyInstallError extends CommonError {
    constructor() {
        super(
            'api_system.INIT_DB_ALREADY_COMPLETE',
            403,
            'INIT_DB_ALREADY_COMPLETE'
        )
    }
}