// Pretendard Font
import 'pretendard/dist/web/variable/pretendardvariable.css';
// Global Style
import '@web/assets/style/global.scss'

import { Metadata } from 'next';
import { PropsWithChildren } from 'react'




export const metadata: Metadata = {
    title: "CrepenCDN",
    description: "Crepen CDN Service",
    openGraph: {
        type: 'website',
        title: "CrepenCDN",
    },
    icons: '/favicon.ico'
};



const RootLayout = ({children}: PropsWithChildren) => {

    return (
        <html>
            <body>
                <div id="root">
                    {children}
                </div>
            </body>
        </html>
    )
}

export default RootLayout;