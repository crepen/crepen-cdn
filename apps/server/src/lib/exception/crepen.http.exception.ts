import { HttpException, HttpStatus } from "@nestjs/common";

export class CrepenLocaleHttpException extends HttpException {
    transLocaleArgs : {[key : string] : string};
    transLocaleCategory? : string;
    transLocaleCode? : string;

    constructor(category : string , messageCode : string , status : number , transLocaleArgs? : {[key : string] : string}){
        super(`${category}.${messageCode}` , status);
        this.transLocaleArgs = transLocaleArgs;
        this.transLocaleCategory = category;
        this.transLocaleCode = messageCode;
    }
}