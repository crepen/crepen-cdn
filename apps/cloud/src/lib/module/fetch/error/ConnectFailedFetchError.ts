import { FetchApiError } from "./FetchApiError";

export class ConnectFailedFetchError extends FetchApiError {
    constructor(errorOptions? : ErrorOptions){
        super('[FetchApi] Connect Failed' , errorOptions);
    }
}