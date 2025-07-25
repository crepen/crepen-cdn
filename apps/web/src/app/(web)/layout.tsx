// Pretendard Font
import 'pretendard/dist/web/variable/pretendardvariable.css';
// Global Style
import '@web/assets/style/common/reset.css';
import '@web/assets/style/common/global.scss'

import '@fortawesome/fontawesome-svg-core/styles.css'
// import '@web/assets/style/common/fontawesome/css/all.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

// import '@web/assets/style/common/fontawesome/css/fontawesome.css';

import { Metadata } from 'next';
import { PropsWithChildren } from 'react'
import { config } from '@fortawesome/fontawesome-svg-core'
import { InitSiteConfig } from '../../component/config/InitSiteConfig';
import { GlobalConfigProvider } from '../../component/config/GlobalConfigProvider';
import { ServerI18nProvider } from '@web/modules/server/i18n/ServerI18nProvider';



config.autoAddCss = false




export const metadata: Metadata = {
    title: "CrepenCDN",
    description: "Crepen CDN Service",
    openGraph: {
        type: 'website',
        title: "CrepenCDN",
    },
    icons: '/favicon.ico',
};



const RootLayoutRouter = async ({ children }: PropsWithChildren) => {

    const lang = await ServerI18nProvider.getSystemLocale();

    return (
        <html lang={lang}>
            <body>
                <GlobalConfigProvider>
                    <InitSiteConfig />
                        <div id="root">
                            {children}
                        </div>
                </GlobalConfigProvider>
            </body>
        </html>
    )
}

export default RootLayoutRouter;