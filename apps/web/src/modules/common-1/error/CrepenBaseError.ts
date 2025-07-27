import { CrepenHttpResult } from "../result/CrepenBaseResult";


/** @deprecated */
export class CrepenBaseError extends Error {
    constructor(message?: string, status?: number, innerError?: Error) {
        super(message)

        this.statusCode = status ?? 500;
        this.innerError = innerError;
    }

    statusCode?: number;
    innerError?: Error;


    toResult = <T,>(): CrepenHttpResult<T> => {
        return new CrepenHttpResult<T>({
            success: false,
            innerError: this.innerError,
            message: this.message,
            statusCode: this.statusCode
        });
    }

    toJson = () => {

        return {
            success: false,
            message: this.message,
            statusCode: this.statusCode,
        };
    }

   
}