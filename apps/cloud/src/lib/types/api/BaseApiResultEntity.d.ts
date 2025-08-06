export interface BaseApiResultEntity<T = unknown> {
    success : boolean,
    timestamp : string,
    statusCode : number,
    data? : T,
    message?: string,
    errorCode? : string
}