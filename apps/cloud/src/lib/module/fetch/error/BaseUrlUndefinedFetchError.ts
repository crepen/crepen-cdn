import { FetchApiError } from "./FetchApiError";

export class BaseUrlUndefinedFetchError extends FetchApiError {
    constructor(errorOptions?: ErrorOptions) {
        super('[FetchApi] Base url not defined.', errorOptions);
    }
}