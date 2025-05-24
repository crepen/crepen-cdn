import { cookies } from "next/headers";

export class CrepenLanguageService {

    private static DEFAULT_LANGUAGE = 'en';
    private static ALLOW_LANGUAGE = ['ko' , 'en'];

    private static CREPEN_LOCALE_KEY = 'crepen_locale'


    static setSessionLocale = async (locale?: string) => {
        const cookie = await cookies();
        cookie.set(this.CREPEN_LOCALE_KEY, locale ?? this.DEFAULT_LANGUAGE);
    }

    static getSessionLocale = async () => {
        const cookie = await cookies();
        return cookie.get(this.CREPEN_LOCALE_KEY)?.value ?? this.DEFAULT_LANGUAGE;
    }

    static getAllowLanguages = () => this.ALLOW_LANGUAGE;
    static getDefaultLanguage = () => this.DEFAULT_LANGUAGE;

}