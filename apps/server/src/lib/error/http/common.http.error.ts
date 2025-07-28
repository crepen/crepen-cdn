import { HttpException } from "@nestjs/common";
import { I18nContext } from "nestjs-i18n";

/** @deprecated */
export interface CrepenCommonHttpLocaleErrorOption {
    transLocaleArgs?: { [key: string]: string },
    innerError? : unknown
}

/** @deprecated */
export class CrepenCommonHttpLocaleError extends HttpException {
    transLocaleArgs: { [key: string]: string };
    transLocaleCategory?: string;
    transLocaleCode?: string;
    innerError? : Error

    constructor(category: string, messageCode: string, status: number, option?: CrepenCommonHttpLocaleErrorOption) {
        super(`${category}.${messageCode}`, status , {
            cause : option?.innerError
        });
        this.innerError = option?.innerError as Error;
        this.transLocaleArgs = option?.transLocaleArgs;
        this.transLocaleCategory = category;
        this.transLocaleCode = messageCode;
    }

    getTransLocaleFullCode = () => {
        return `${this.transLocaleCategory}.${this.transLocaleCode}`;
    }

    getTransLocaleErrorMessage = (i18n : I18nContext<Record<string, unknown>>) => {
        return i18n.t<string,string>(this.getTransLocaleFullCode());
    }
}