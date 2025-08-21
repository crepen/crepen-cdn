import { CommonError } from "../../common.error";

export class UserUnvalidateIdError extends CommonError{
     constructor() {
        super(
            'api_user.PARAM.UNVALIDATE.ID',
            403,
            'PARAM.UNVALIDATE.ID'
        )
    }
}