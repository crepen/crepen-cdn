import { cookies } from "next/headers";
import { BaseServiceResult } from "../types/common.service";
import { CrepenCookieOperationService } from "../operation/cookie.operation.service";

/** @deprecated */
export class CrepenLanguageService {

    private static DEFAULT_LANGUAGE = 'en';
    private static ALLOW_LANGUAGE = ['ko' , 'en'];

    private static CREPEN_LOCALE_KEY = 'crepen_locale'


    static setSessionLocale = async (locale?: string): Promise<BaseServiceResult> => {
        return CrepenCookieOperationService.insertLocaleData(locale ?? this.DEFAULT_LANGUAGE);
    }

    static getSessionLocale = async (): Promise<BaseServiceResult<string>> => {
        const sessionLocale = await CrepenCookieOperationService.getLocaleData();
        return  {
            success : sessionLocale.success,
            data : sessionLocale.data ?? this.DEFAULT_LANGUAGE,
            innerError : sessionLocale.innerError,
            message : sessionLocale.message
        }
    }

    static getAllowLanguages = () => this.ALLOW_LANGUAGE;
    static getDefaultLanguage = () => this.DEFAULT_LANGUAGE;

}