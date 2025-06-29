import { CrepenBaseResult } from "../result/CrepenBaseResult";


export class CrepenBaseError extends Error {
    constructor(message?: string, status?: number, innerError?: Error) {
        super(message)

        this.statusCode = status ?? 500;
        this.innerError = innerError;
    }

    statusCode?: number;
    innerError?: Error;


    toResult = <T,>(): CrepenBaseResult<T> => {
        return new CrepenBaseResult<T>({
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