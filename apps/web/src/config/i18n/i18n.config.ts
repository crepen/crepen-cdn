import { StringUtil } from "@web/lib/util/string.util";
import { readFileSync } from "fs-extra";







export type Locale = (typeof I18nProvider.config)['locales'][number];

export class I18nProvider {
    constructor() {

    }

    static config = {
        defaultLocale: 'en',
        locales: ['en', 'ko'],
    } as const;

    static instance = () => {
        return new I18nProvider();
    }

    getAllTranslateData = async () => {
        const resultData : Record<string,unknown> = {};
        
        for(const locale of I18nProvider.config.locales){
            resultData[locale] = await this.getTranslation(locale);
        }

        return resultData;
    }

    getTranslation = (locale?: string) => {
        return this.getLocaleFile(locale).then((module) => module);
    }

    private getLocaleFile = async (locale?: string) => {
        try {
            let appendLocale = 'en';

            if (!StringUtil.isEmpty(locale) && I18nProvider.config.locales.find(x => x === locale)) {
                appendLocale = locale ?? 'en';
            }


            const localeFilePath = `./locale/${appendLocale}.json`;

            try{
                const fileJsonData = readFileSync(localeFilePath).toJSON();
                return fileJsonData;
            }
            catch(e){
                return undefined;
            }
            return undefined;
        }
        catch (e) {
            return { default: {} }
        }
    }
}