export interface CrepenApiResponse<T=unknown> {
    data?: T,
    message?: string,
    success: boolean,
    statusCode? : number
}


export interface CrepenApiOptions {
    token? : string,
    language? : string
}