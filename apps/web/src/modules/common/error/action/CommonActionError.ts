import { BaseSystemError } from "../BaseSystemError";

export class CommonActionError extends BaseSystemError{
    static errorResult = (message? : string) => {
        return new CommonActionError(message);   
    }
}