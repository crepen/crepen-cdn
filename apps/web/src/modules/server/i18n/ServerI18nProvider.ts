import { cookies } from "next/headers";
import { I18nProvider } from "../../../config/i18n/i18n.config";
import { ObjectUtil } from "@web/lib/util/object.util";
import { StringUtil } from "@web/lib/util/string.util";

export type ServerLocaleType = 'en' | 'ko';

export class ServerI18nProvider {

    static getTranslationData = async (locale?: string): Promise<Record<string, unknown>> => {
        const defaultTranslation = await I18nProvider.instance().getTranslation('en');
        const targetTranslation = await I18nProvider.instance().getTranslation(locale);

        const merged = ObjectUtil.deepMerge(targetTranslation, defaultTranslation);
        return merged;
    }

    static getTranslationText = async (locale?: string, path?: string): Promise<string | undefined> => {

        const merged = await this.getTranslationData(locale);

        let targetResult: string | Record<string, unknown> | undefined = merged;

        if (!StringUtil.isEmpty(path)) {
            const pathDept = path!.split('.');

            for (const dept of pathDept) {
                if (!ObjectUtil.isObject(targetResult)) {
                    return undefined;
                }

                targetResult = targetResult[dept] as Record<string, unknown>;
            }
        }

        return typeof targetResult === 'string' ? targetResult : undefined;
    }

    static getSystemTranslationText = async (path?: string): Promise<string | undefined> => {
        const systemLocale = await this.getSystemLocale();
        return this.getTranslationText(systemLocale, path);
    }

    static getSystemLocale = async (): Promise<string | undefined> => {
        const cookie = await cookies();

        if (cookie.has('CP_LOCALE')) {
            return await cookie.get('CP_LOCALE')?.value;
        }
        else {
            return undefined;
        }
    }

    static setSystemLocale = async (locale?: string) => {
        let appendLocale = 'en';

        if (!StringUtil.isEmpty(locale) && I18nProvider.config.locales.find(x => x === locale)) {
            appendLocale = locale ?? 'en';
        }

        const cookie = await cookies();
        cookie.set('CP_LOCALE', appendLocale);

        return appendLocale;
    }
}