export interface CrepenApiResultProp<T = unknown> {
    success: boolean,
    message?: string,
    errorCode?: string,
    statusCode?: number,
    data?: T,
    innerError?: Error
}

export class CrepenApiResult<T = unknown | undefined> {

    constructor(prop: CrepenApiResultProp<T>) {
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