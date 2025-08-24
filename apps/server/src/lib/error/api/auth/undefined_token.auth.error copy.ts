import { CommonError } from "../../common.error";

export class AuthUserTokenUndefinedError extends CommonError{
     constructor() {
        super(
            'api_auth.UNAUTHORIZED.TOKEN_UNDEFINED',
            401,
            'UNAUTHORIZED.TOKEN_UNDEFINED'
        )
    }
}