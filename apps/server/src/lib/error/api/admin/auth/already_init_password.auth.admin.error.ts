import { CommonError } from "@crepen-nest/lib/error/common.error";

export class AlreadySetupInitPasswordError extends CommonError {
      constructor() {
        super(
            'api_admin_auth.INIT_ACCOUNT.ALREADY_INIT_PASSWORD',
            403,
            'INIT_ACCOUNT.ALREADY_INIT_PASSWORD'
        )
    }
}