import { CommonError } from "./common.error";

export class TokenUnauthorizeError extends CommonError{
    constructor() {
        super(
            'system_auth.UNAUTHORIZED',
            401,
            'UNAUTHORIZED'
        )
    }
}