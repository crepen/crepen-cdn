// Pretendard Font
import 'pretendard/dist/web/variable/pretendardvariable.css';
// Global Style
import '@web/assets/styles/global/reset.css';
import '@web/assets/styles/global/global.scss';
// FontAwesome
import '@fortawesome/fontawesome-svg-core/styles.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

import '@web/assets/styles/layout/root.layout.scss';

import { PropsWithChildren } from "react"
import { Metadata } from 'next';
import { GlobalSetupProvider } from '../components/global/config/GlobalSetupProvider';

export const metadata: Metadata = {
    title: "CrepenCDN",
    description: "Crepen CDN Service",
    openGraph: {
        type: 'website',
        title: "CrepenCDN",
    }
};

const RootLayout = async (prop: PropsWithChildren) => {



    return (
        <html>
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