import { CommonError } from "../../common.error";

export class AuthUserTokenExpiredError extends CommonError{
     constructor() {
        super(
            'api_auth.UNAUTHORIZED.TOKEN_EXPIRED',
            401,
            'UNAUTHORIZED.TOKEN_EXPIRED'
        )
    }
}