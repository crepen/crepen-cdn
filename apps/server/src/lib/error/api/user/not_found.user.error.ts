import { CommonError } from "../../common.error";

export class UserNotFoundError extends CommonError{
     constructor() {
        super(
            'api_user.NOT_FOUND.USER',
            404,
            'NOT_FOUND.USER'
        )
    }
}