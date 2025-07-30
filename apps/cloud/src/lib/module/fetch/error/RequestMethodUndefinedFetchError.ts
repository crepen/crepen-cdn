import { FetchApiError } from "./FetchApiError";

export class RequestMethodUndefinedFetchError extends FetchApiError {
    constructor(errorOptions?: ErrorOptions) {
        super('[FetchApi] Request method not defined.', errorOptions);
    }
}