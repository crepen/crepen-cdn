import { CommonError } from "../../common.error";

export class UserInvalidateIdError extends CommonError{
     constructor() {
        super(
            'api_user.PARAM.INVALIDATE.ID',
            403,
            'PARAM.INVALIDATE.ID'
        )
    }
}