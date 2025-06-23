export interface BaseServiceResult<T=unknown> extends BaseServiceResult {
    data?: T
}

export interface BaseServiceResult {
    success: boolean,
    message?: string,
    innerError? : Error,
    statusCode? : number
}