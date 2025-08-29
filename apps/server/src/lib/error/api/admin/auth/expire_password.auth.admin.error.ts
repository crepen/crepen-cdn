import { CommonError } from "@crepen-nest/lib/error/common.error";

export class ExpireAdminPasswordError extends CommonError {
    constructor() {
        super(
            'api_admin_auth.PASSWORD.EXPIRE',
            403,
            'PASSWORD.EXPIRE'
        )
    }
}