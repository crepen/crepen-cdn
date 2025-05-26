// Pretendard Font
import 'pretendard/dist/web/variable/pretendardvariable.css';
// Global Style
import '@web/assets/style/common/reset.css';
import '@web/assets/style/common/global.scss'

import '@fortawesome/fontawesome-svg-core/styles.css'

import { Metadata } from 'next';
import { PropsWithChildren } from 'react'
import { InitClient } from '../../components/config/init-client';
import { config } from '@fortawesome/fontawesome-svg-core'
import { CrepenLanguageService } from '@web/services/common/language.service';



config.autoAddCss = false




export const metadata: Metadata = {
    title: "CrepenCDN",
    description: "Crepen CDN Service",
    openGraph: {
        type: 'website',
        title: "CrepenCDN",
    },
    icons: '/favicon.ico'
};



const RootLayoutRouter = async ({ children }: PropsWithChildren) => {

    const lang = await CrepenLanguageService.getSessionLocale();

    return (
        <html lang={lang}>
            <body>
                <InitClient >
                    <div id="root">
                        {children}
                    </div>
                </InitClient>
            </body>
        </html>
    )
}

export default RootLayoutRouter;