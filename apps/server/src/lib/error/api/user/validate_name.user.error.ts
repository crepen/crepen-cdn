import { CommonError } from "../../common.error";

export class UserInvalidateNameError extends CommonError{
     constructor() {
        super(
            'api_user.PARAM.INVALIDATE.NAME',
            403,
            'PARAM.INVALIDATE.NAME'
        )
    }
}