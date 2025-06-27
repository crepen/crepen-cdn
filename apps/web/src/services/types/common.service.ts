
/** @deprecated */
export class BaseServiceResult<T = unknown> {
    data?: T
    success?: boolean;
    message?: string;
    innerError?: Error;
    statusCode?: number;
    errorCode?: string;
}