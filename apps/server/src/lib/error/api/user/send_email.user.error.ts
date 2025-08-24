import { CommonError } from "../../common.error";

export class SendResetPasswordMailFailed extends CommonError{
     constructor() {
        super(
            'api_user.SEND_MAIL.RESET.PASSWORD',
            502,
            'SEND_MAIL.RESET.PASSWORD'
        )
    }
}