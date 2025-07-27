'use server'

import { Fragment, PropsWithChildren } from "react"
import { GlobalModalProvider } from "./GlobalModalProvider"
import { GlobalLocaleProvider } from "./GlobalLocaleProvider"
import { I18nProvider } from "../../config/i18n/i18n.config"
import { ServerI18nProvider } from "@web/modules/server/i18n/ServerI18nProvider"
import { GlobalLoadingProvider } from "./GlobalLoadingProvider"
import { GlobalDetectDeviceProvider } from "./GlobalDetectDeviceProvider"
import { GlobalBasePathProvider } from "./GlobalBasePathProvider"
import { CustomEnvProvider } from "@web/modules/server/service/CustomEnvProvider"

export const GlobalConfigProvider = async (prop: PropsWithChildren) => {

    const locale = await ServerI18nProvider.getSystemLocale();
    const localeTranslateData = await I18nProvider.instance().getAllTranslateData();
    const basePath = await CustomEnvProvider.getBasePath();


    return (
        <Fragment>
            <GlobalDetectDeviceProvider />
            <GlobalBasePathProvider
                basePath={basePath}
            >
                <GlobalLocaleProvider
                    systemLocale={locale}
                    localeTranslateData={localeTranslateData}
                    defaultLocale={I18nProvider.config.defaultLocale}
                >
                    <GlobalLoadingProvider>
                        <GlobalModalProvider>


                            {prop.children}



                        </GlobalModalProvider>
                    </GlobalLoadingProvider>

                </GlobalLocaleProvider>
            </GlobalBasePathProvider>

        </Fragment>
    )
}