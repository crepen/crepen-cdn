import { CommonError } from "./common.error";

export class NotAllowTokenTypeError extends CommonError{
     constructor() {
        super(
            'system_auth.AUTHORIZATION_NOT_ALLOW_TYPE',
            401,
            'AUTHORIZATION_NOT_ALLOW_TYPE'
        )
    }
}