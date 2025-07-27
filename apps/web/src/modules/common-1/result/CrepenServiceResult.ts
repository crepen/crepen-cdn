import { CrepenApiResult } from "./CrepenApiResult";
import { CrepenHttpResult, CrepenHttpResultInterface } from "./CrepenBaseResult";

export class CrepenServiceResult<T = Record<string,unknown>> extends CrepenHttpResult<T | undefined | null> {
    constructor(data : CrepenHttpResultInterface<T | undefined | null>){
        super(data);
    }

    static applyApiResult = <T=Record<string,unknown>>(data : CrepenApiResult<T>) => {
        const instance = new CrepenServiceResult({
            success : data.success,
            data : data.data,
            errorCode : data.errorCode,
            innerError : data.innerError,
            message : data.message,
            statusCode : data.statusCode
        });

        return instance;
    }
}