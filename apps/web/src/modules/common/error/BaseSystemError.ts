export interface BaseSystemErrorOptions extends ErrorOptions {
    innerError? : Error
}

export class BaseSystemError extends Error {
    constructor(message? : string , errorOptions? : BaseSystemErrorOptions){
        super(message , errorOptions)
        this.options = errorOptions;

        console.log('[BASE_SYSTEM_ERROR]',this.message);
    }


    options? : BaseSystemErrorOptions;



    static clone = (e : Error) => {
        return new BaseSystemError(e.message , {innerError : e})
    }
}