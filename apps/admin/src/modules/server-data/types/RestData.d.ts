export interface RestDataResult<T = unknown> {
    success : boolean,
    status : number,
    statusCode : string,
    data? : T,
    message? : string,
    timestamp : string
}