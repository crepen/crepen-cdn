'use client'

import { LocaleDataType } from "@web/lib/module/locale/ServerLocaleProvider";
import { StringUtil } from "@web/lib/util/StringUtil";
import { createContext, PropsWithChildren, useContext } from "react"
import * as DotProp from 'dot-prop'


interface ClientLocaleContextProp {
    getLocale: () => string,
    translate: (text?: string,locale?: string) => string | undefined,
    getSupportLocale : () => string[],
    getDefaultLocale : () => string
}


const ClientLocaleContext = createContext<ClientLocaleContextProp | undefined>(undefined);


export const useClientLocale = () => {
    const context = useContext(ClientLocaleContext);
    if (context === undefined) throw new Error("useClientLocale must be used within Provider");
    return context;
}

interface ClientLocaleProviderProp extends PropsWithChildren {
    systemLocale?: string,
    defaultLocale: string,
    localeData?: LocaleDataType,
    supportLanguages? : string[]
}

export const ClientLocaleProvider = (prop: ClientLocaleProviderProp) => {
    return (
        <ClientLocaleContext.Provider value={{
            getLocale: () => {
                const locale = prop.systemLocale ?? prop.defaultLocale;
                return locale;
            },
            translate: (text?: string, locale?: string) => {
                if (!prop.localeData) return undefined;
                if (StringUtil.isEmpty(text)) return undefined;
                const targetLocale = locale ?? prop.systemLocale ?? prop.defaultLocale;

                const defaultLocaleText = DotProp.getProperty(prop.localeData[prop.defaultLocale] ?? {}, text!)

                if (targetLocale === prop.defaultLocale) {
                    return defaultLocaleText ?? text;
                }

                const targetLocaleText = DotProp.getProperty(prop.localeData[targetLocale] ?? {} , text!);

                return targetLocaleText ?? defaultLocaleText ?? text;

            },
            getSupportLocale : () => {
                return prop.supportLanguages ?? []
            },
            getDefaultLocale : () => {
                return prop.defaultLocale
            }
        }}>
            {prop.children}
        </ClientLocaleContext.Provider>
    )
}