import { CommonError } from "../../common.error";

export class UserDuplicateEmailError extends CommonError{
     constructor() {
        super(
            'api_user.PARAM.DUPLICATE.EMAIL',
            403,
            'PARAM.DUPLICATE.EMAIL'
        )
    }
}