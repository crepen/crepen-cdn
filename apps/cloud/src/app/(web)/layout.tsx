// Pretendard Font
import 'pretendard/dist/web/variable/pretendardvariable.css';
// Global Style
import '@web/assets/styles/global/reset.css';
import '@web/assets/styles/global/global.scss';
import '@web/assets/styles/global/controls.scss'
// FontAwesome
import '@fortawesome/fontawesome-svg-core/styles.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

import { PropsWithChildren } from "react"
import { Metadata, Viewport } from 'next';
import { GlobalSetupProvider } from '../../components/global/config/GlobalSetupProvider';
import { LocaleConfig } from '@web/lib/config/LocaleConfig';
import { ServerLocaleInitializer } from '@web/lib/module/locale/ServerLocaleInitializer';
import { cookies, headers } from 'next/headers';
import urlJoin from 'url-join';
import { BasePathInitializer } from '@web/lib/module/basepath/BasePathInitializer';



export const generateMetadata = async (): Promise<Metadata> => {

    const basePath = await BasePathInitializer.get({ readHeader: await headers() });

    return {
        title: {
            default : "CrepenCDN",
            template : "CrepenCDN | %s"
        },
        description: "Crepen CDN Service",
        openGraph: {
            type: 'website',
            title: "CrepenCDN",
        },
        icons: urlJoin(basePath, '/resource/image/favicon.svg')
    }
}

export const viewport : Viewport = {
    userScalable : false
}


const RootLayout = async (prop: PropsWithChildren) => {

    // ServerLocaleProvider.current(LocaleConfig).getLocaleData();
    const locale = await ServerLocaleInitializer.current(LocaleConfig).get({ readCookie: await cookies() })

    return (
        <html lang={locale ?? LocaleConfig.defaultLocale}>
            <body>
                <div id="root">
                    <GlobalSetupProvider>
                        {prop.children}
                    </GlobalSetupProvider>
                </div>
            </body>
        </html>
    )
}

export default RootLayout;