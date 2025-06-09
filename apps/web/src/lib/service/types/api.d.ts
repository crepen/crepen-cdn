export interface CrepenApiResponse<T> {
    data?: T,
    message?: string,
    success?: boolean
}


export interface CrepenApiOptions {
    token? : string,
    language? : string
}