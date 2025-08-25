import { CommonError } from "../../common.error";

export class UserInvalidateEmailError extends CommonError{
     constructor() {
        super(
            'api_user.PARAM.INVALIDATE.EMAIL',
            403,
            'PARAM.INVALIDATE.EMAIL'
        )
    }
}