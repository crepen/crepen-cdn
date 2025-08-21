import { CommonError } from "../../common.error";

export class UserUnapprovalError extends CommonError{
     constructor() {
        super(
            'api_user.UNAPPROVAL.ACCOUNT',
            404,
            'UNAPPROVAL.ACCOUNT'
        )
    }
}