import { CommonError } from "../../common.error";

export class UserUnvalidatePasswordError extends CommonError{
     constructor() {
        super(
            'api_user.PARAM.UNVALIDATE.PASSWORD',
            403,
            'PARAM.UNVALIDATE.PASSWORD'
        )
    }
}