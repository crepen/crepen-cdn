import { HttpException } from "@nestjs/common";

interface CrepenLocaleHttpExceptionOption {
    transLocaleArgs?: { [key: string]: string },
    innerError? : unknown
}

export class CrepenLocaleHttpException extends HttpException {
    transLocaleArgs: { [key: string]: string };
    transLocaleCategory?: string;
    transLocaleCode?: string;

    constructor(category: string, messageCode: string, status: number, option?: CrepenLocaleHttpExceptionOption) {
        super(`${category}.${messageCode}`, status , {
            cause : option.innerError
        });
        this.transLocaleArgs = option.transLocaleArgs;
        this.transLocaleCategory = category;
        this.transLocaleCode = messageCode;
    }
}