import { HttpException, HttpExceptionOptions } from "@nestjs/common";
import { I18nContext } from "nestjs-i18n";

type LocaleMessageOptionArgs = ({
    [k: string]: any;
} | string)[] | {
    [k: string]: any;
};

type LocaleMessageOptions = {
    locale?: string,
    args?: LocaleMessageOptionArgs,
    context? : I18nContext
}

export class CommonError extends HttpException {
    constructor(message?: string, statusCode?: number, errorCode?: string, options?: HttpExceptionOptions) {
        super(message, statusCode, options);
        this.errorCode = errorCode;
    }

    private errorCode?: string;


    getErrorCode = () => this.errorCode;

    getLocaleMessage = (options?: LocaleMessageOptions  ) => {

        const i18nContext = options?.context ?? I18nContext.current();
        const supportLocale = i18nContext.service.getSupportedLanguages();


        const currentLocale = supportLocale.find(x => x === options?.locale) ? options?.locale : i18nContext.lang;
        // const currentLocale = i18nContext.service.resolveLanguage('');;


        return i18nContext.translate<string,string>(this.message ?? '', {
            args: options?.args,
            lang: currentLocale
        })
    }
}