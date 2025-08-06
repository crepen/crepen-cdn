import { CommonError } from "../../common.error";

export class FailedSignInError extends CommonError {
    constructor(){
        super (
            'api_auth.AUTH.FAILED_SIGNIN',
            401,
            'AUTH.FAILED_SIGNIN'
        )
    }
}