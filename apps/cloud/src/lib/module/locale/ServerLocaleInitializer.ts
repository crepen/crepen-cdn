import { LocaleConfigType } from "./ServerLocaleProvider";
import { StringUtil } from "@web/lib/util/StringUtil";
import { Cookies } from "@web/lib/types/Common";
import { cookies, headers } from "next/headers";

type ServerLocaleInitOptions = {
    readCookie?: Cookies,
    writeCookie?: Cookies
}

export class ServerLocaleInitializer {
    constructor(localeConfig: LocaleConfigType) {

        this.config = localeConfig;
    }

    private config: LocaleConfigType;
    private cookieKey: string = 'CP_LOCALE';


    static current = (localeConfig: LocaleConfigType) => {
        return new ServerLocaleInitializer(localeConfig)
    }


    set = async (locale?: string, options?: ServerLocaleInitOptions) => {
        let targetLocale = locale;

        if (!this.config.supportLocales.find(x => x.trim().toLowerCase() === locale?.trim().toLowerCase())) {
            targetLocale = undefined;
        }

        if (!StringUtil.isEmpty(targetLocale)) {
            (options?.writeCookie ?? await headers()).set(this.cookieKey, targetLocale!, {
                httpOnly: true,
                maxAge: 60 * 60 * 24 * 365,
                secure: process.env.NODE_ENV === 'development' ? false : true
            });
        }


    }

    get = async (options?: ServerLocaleInitOptions) => {
        const cookieLocale = (options?.readCookie ?? await cookies()).get(this.cookieKey)?.value?.trim().toLowerCase();
        if (
            StringUtil.isEmpty(cookieLocale)
            || !this.config.supportLocales.find(x => x.trim().toLowerCase() === cookieLocale)
        ) {
            return undefined;
        }

        return cookieLocale!;
    }

}