import { CommonError } from "../../common.error";

export class UserInvalidatePasswordError extends CommonError{
     constructor() {
        super(
            'api_user.PARAM.INVALIDATE.PASSWORD',
            403,
            'PARAM.INVALIDATE.PASSWORD'
        )
    }
}