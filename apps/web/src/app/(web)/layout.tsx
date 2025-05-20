// Pretendard Font
import 'pretendard/dist/web/variable/pretendardvariable.css';
// Global Style
import '@web/assets/style/common/global.scss'

import { Metadata } from 'next';
import { PropsWithChildren } from 'react'
import { InitClient } from '../../components/config/init-client';




export const metadata: Metadata = {
    title: "CrepenCDN",
    description: "Crepen CDN Service",
    openGraph: {
        type: 'website',
        title: "CrepenCDN",
    },
    icons: '/favicon.ico'
};



const RootLayoutRouter = ({children}: PropsWithChildren) => {

    return (
        <html>
            <body>
                <div id="root">
                    <InitClient />
                    {children}
                </div>
            </body>
        </html>
    )
}

export default RootLayoutRouter;