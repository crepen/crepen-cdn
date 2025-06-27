import { CrepenBaseResult } from "./CrepenBaseResult";
import { CrepenServiceResult } from "./CrepenServiceResult";

export class CrepenApiResult<T = unknown> extends CrepenBaseResult<T> {


    static toServiceResponse = <T,>(response: CrepenApiResult<T>): CrepenServiceResult<T> => {
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