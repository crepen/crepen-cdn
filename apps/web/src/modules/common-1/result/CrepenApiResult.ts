import { CrepenHttpResult } from "./CrepenBaseResult";
import { CrepenServiceResult } from "./CrepenServiceResult";

export class CrepenApiResult<T = Record<string,unknown>>  extends CrepenHttpResult<T | undefined | null> {


    static toServiceResponse = <T,>(response: CrepenApiResult<T | undefined | null>): CrepenServiceResult<T> => {
        const result = new CrepenServiceResult<T>({
            data: response.data,
            success: response.success,
            message: response.message,
            statusCode: response.statusCode,
            errorCode: response.errorCode
        });

        return result;
    }
}