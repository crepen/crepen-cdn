'use server';

import { Fragment, PropsWithChildren } from "react"
import { ClientLocaleProvider } from "../../../lib/module/locale/ClientLocaleProvider";
import { LocaleConfig } from "@web/lib/config/LocaleConfig";
import { ServerLocaleProvider } from "@web/lib/module/locale/ServerLocaleProvider";
import { ServerLocaleInitializer } from "@web/lib/module/locale/ServerLocaleInitializer";
import { cookies, headers } from "next/headers";
import { ClientBasePathProvider } from "@web/lib/module/basepath/ClientBasePathProvider";
import { BasePathInitializer } from "@web/lib/module/basepath/BasePathInitializer";

export const GlobalSetupProvider = async (prop: PropsWithChildren) => {

    const basePath = await BasePathInitializer.get({ readHeader: await headers() });

    return (
        <Fragment>
            <ClientLocaleProvider
                systemLocale={await ServerLocaleInitializer.current(LocaleConfig).get({ readCookie: await cookies() })}
                defaultLocale={LocaleConfig.defaultLocale}
                localeData={await ServerLocaleProvider.current(LocaleConfig).getFileData()}
                supportLanguages={LocaleConfig.supportLocales}
            >
                <ClientBasePathProvider
                    basePath={basePath}
                >
                    {prop.children}
                </ClientBasePathProvider>

            </ClientLocaleProvider>

        </Fragment>
    )
}