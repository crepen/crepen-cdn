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
import { InitClient } from '../../components/config/init-client';
import { config } from '@fortawesome/fontawesome-svg-core'
import { CrepenLanguageService } from '@web/services/common/language.service';
import { cookies, headers } from 'next/headers';
import { InitSiteConfig } from '@web/components-new/global/config/init-site/InitSiteConfig';
import { CrepenGlobalProvider } from '@web/components-v2/page/(global)/config/global-provider/CrepenGlobalProvider';



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

    const lang = await CrepenLanguageService.getSessionLocale();

    const basePath = (await headers()).get('x-crepen-basepath')?.toString()



    return (
        <html lang={lang.data}>
            <body>
                <CrepenGlobalProvider>
                    <InitSiteConfig />
                    <InitClient
                        basePath={basePath}
                        language={lang.data}
                    >
                        <div id="root">
                            {children}
                        </div>
                    </InitClient>
                </CrepenGlobalProvider>
            </body>
        </html>
    )
}

export default RootLayoutRouter;