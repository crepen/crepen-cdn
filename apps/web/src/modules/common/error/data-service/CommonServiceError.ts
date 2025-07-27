import { BaseSystemError } from "../BaseSystemError";

export class CommonServiceError extends BaseSystemError {

    static errorResult = (message? : string) => {
        return new CommonServiceError(message);   
    }
}