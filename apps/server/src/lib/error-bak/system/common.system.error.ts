
/** @deprecated */
export class CrepenSystemError extends Error {

    constructor(message : string , context : string , options? : ErrorOptions){
        super(message , options);

        this.context = context;
    }

    context : string;
}