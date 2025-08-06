import { readFileSync } from "fs-extra";
import path from "path"
import { ObjectUtil } from "../../util/ObjectUtil";

export type LocaleConfigType = {
    defaultLocale: string,
    supportLocales: string[]
}

export type LocaleDataType = {
    [locale: string]: object
}

export class ServerLocaleProvider {

    constructor(localeConfig: LocaleConfigType) {
        this.config = localeConfig;
    }

    config: LocaleConfigType;

    static current = (localeConfig: LocaleConfigType) => {
        return new ServerLocaleProvider(localeConfig);
    }

    getLocaleData = (locale : string) : object => {
        const localeData: LocaleDataType = (globalThis as Record<string, unknown>).localeData as LocaleDataType;

        if(
            !this.config.supportLocales.map(x=>x.toLowerCase()).find(x=>x === locale.toLowerCase())
            || this.config.defaultLocale.toLowerCase() === locale.toLowerCase()
        ){
            return localeData[this.config.defaultLocale.toLowerCase()] ?? {};
        }

        const defaultLocaleData = this.getLocaleData(this.config.defaultLocale);
        const targetLocaleData = localeData[locale.toLowerCase()] ?? {};

        return ObjectUtil.deepMerge(defaultLocaleData , targetLocaleData);
    }

    getFileData = async () : Promise<LocaleDataType> => {
        const localeDirPath = path.join(process.cwd(), './public/locale');

        const localeDataRecord: Record<string, Record<string, unknown>> = {};

        for (const locale of this.config.supportLocales) {
            try {
                const localeData = JSON.parse(
                    readFileSync(path.join(localeDirPath, `${locale}.json`)).toString()
                );
                localeDataRecord[locale] = localeData;
            }
            catch (e) {
                localeDataRecord[locale] = {};
            }
        }

        (globalThis as Record<string, unknown>).localeData = localeDataRecord;

        // console.log(localeDataRecord);

        return localeDataRecord;
    }


    isSupportLocale = async (locale? : string) : Promise<boolean> => {
        if(!this.config.supportLocales.find(x=>x.trim().toLowerCase() === locale?.trim().toLowerCase())){
            return false;
        }
        else{
            return true;
        }
    }

    
}