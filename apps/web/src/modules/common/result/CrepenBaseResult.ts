export interface CrepenHttpResultInterface<T = unknown> {
    success: boolean,
    message?: string,
    errorCode?: string,
    statusCode?: number,
    data?: T,
    innerError?: Error
}

export class CrepenHttpResult<T = unknown> {

    constructor(prop: CrepenHttpResultInterface<T>) {
        this.success = prop.success ?? false;
        this.message = prop.message;
        this.errorCode = prop.errorCode;
        this.statusCode = prop.statusCode;
        this.data = prop.data;
        this.innerError = prop.innerError;
    }

    success: boolean;
    message?: string;
    errorCode?: string;
    statusCode?: number;
    data?: T;
    innerError?: Error
}