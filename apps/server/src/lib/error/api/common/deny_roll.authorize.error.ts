import { CommonError } from "../../common.error";

export class DenyRollError extends CommonError {
    constructor() {
        super(
            'system_auth.DENY_ROLL',
            401,
            'DENY_ROLL'
        )
    }
}