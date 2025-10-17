export class CrepenBaseError extends Error{

    constructor(errorCode: string , statusCode : number , errorMessage?: string){
        super(errorMessage ?? errorCode);
        this._statusCode = statusCode;
        this._errorCode = errorCode;
    }

    private _statusCode? : number;
    private _errorCode? :string;


    getStatusCode = () => this._statusCode;
    getErrorCode = () => this._errorCode;
}