export interface CrepenApiResponse<T extends any> {
    data?: T,
    message?: string,
    success?: boolean
}