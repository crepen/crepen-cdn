'use client';

import { ObjectUtil } from "@web/lib/util/object.util";
import { StringUtil } from "@web/lib/util/string.util";
import { createContext, PropsWithChildren, useContext } from "react"

interface GlobalLocaleContextProp {
    locale: string,
    translateData: Record<string, unknown>,
    getTranslation: (path: string , locale? : string) => string | undefined
}

const GlobalLocaleContext = createContext<GlobalLocaleContextProp | undefined>(undefined);

export const useGlobalLocale = () => {
    const context = useContext(GlobalLocaleContext);
    if (context === undefined) throw new Error("useGlobalLocale must be used within ItemProvider");
    return context;
}


interface GlobalLocaleProviderProp extends PropsWithChildren {
    systemLocale: string | undefined,
    localeTranslateData: Record<string, unknown>,
    defaultLocale: string
}

export const GlobalLocaleProvider = (prop: GlobalLocaleProviderProp) => {

    return (
        <GlobalLocaleContext.Provider value={{
            locale: prop.systemLocale ?? prop.defaultLocale,
            translateData: prop.localeTranslateData,
            getTranslation: (path: string , inputLocale? : string) => {
                const locale = inputLocale ?? prop.systemLocale ?? prop.defaultLocale;

                const defaultTranslateData = prop.localeTranslateData[prop.defaultLocale] as Record<string,unknown>;
                const translateData = prop.localeTranslateData[locale] as Record<string,unknown>;

                const targetTranslateData = ObjectUtil.deepMerge(defaultTranslateData ,translateData );

                

                let targetResult: string | Record<string, unknown> | undefined = targetTranslateData;

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
        }}>
            {prop.children}
        </GlobalLocaleContext.Provider>
    )
}