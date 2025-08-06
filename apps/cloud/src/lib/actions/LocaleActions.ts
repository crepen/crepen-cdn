'use server'

import { cookies } from "next/headers";
import { LocaleConfig } from "../config/LocaleConfig"
import { ServerLocaleInitializer } from "../module/locale/ServerLocaleInitializer";
import { ServerLocaleProvider } from "../module/locale/ServerLocaleProvider"

interface ChangeLocaleResult {
    state: boolean,
    changeLocale: string
}

export const ChangeLocaleAction = async (changeLocale?: string): Promise<ChangeLocaleResult> => {

    const prov = ServerLocaleProvider.current(LocaleConfig);
    const init = ServerLocaleInitializer.current(LocaleConfig)

    if (await prov.isSupportLocale(changeLocale)) {
        await init.set(changeLocale!.trim().toLowerCase(), { writeCookie: await cookies() });
        return {
            state: true,
            changeLocale: changeLocale!
        }
    }
    else {
        await init.set(prov.config.defaultLocale, { writeCookie: await cookies() });
        return {
            state: true,
            changeLocale: prov.config.defaultLocale
        }
    }
}