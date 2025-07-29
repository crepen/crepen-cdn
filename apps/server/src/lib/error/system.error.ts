export interface SystemErrorOptions extends ErrorOptions{
    innerError? : Error
}

export class SystemError extends Error {
    constructor(message? : string , errorOptions? : SystemErrorOptions){
        super(message , errorOptions);
        this.innerError = errorOptions?.innerError;
    }

    private innerError? : Error;

    getInnerError = () => this.innerError;

}