import { BaseSystemError, BaseSystemErrorOptions } from "../BaseSystemError";

export class CommonRouteError extends BaseSystemError{
    constructor(message? : string , statusCode?: number , errorOptions? : BaseSystemErrorOptions

    ){
        super(message , errorOptions);
        this.statusCode = statusCode;
    }

    statusCode? : number;


    toResponseJson = () => {
        return {
            success: false,
            message: this.message,
            statusCode: this.statusCode,
        };
    }
}