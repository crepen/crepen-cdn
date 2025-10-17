import { CrepenBaseError } from "./CrepenBaseError";

export class CrepenActionError extends CrepenBaseError {
    constructor(errorCode: string , statusCode : number , errorMessage?: string){
        super(errorCode , statusCode , errorMessage);
    }
}