import { CommonError } from "../../common.error";

export class UserDuplicateIdError extends CommonError{
     constructor() {
        super(
            'api_user.PARAM.DUPLICATE.ID',
            403,
            'PARAM.DUPLICATE.ID'
        )
    }
}