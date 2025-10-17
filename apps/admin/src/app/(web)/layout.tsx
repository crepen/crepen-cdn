// Pretendard Font
import 'pretendard/dist/web/variable/pretendardvariable.css';
// FontAwesome
import '@fortawesome/fontawesome-svg-core/styles.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
// Style
import '@web/assets/styles/reset.css';
import '@web/assets/styles/global.scss';

import { PropsWithChildren } from "react";
import { Metadata, Viewport } from 'next';
import urlJoin from "url-join";
import { LocaleProvider } from '../../modules/locale-module/LocaleProvider';


export const generateMetadata = async (): Promise<Metadata> => {

    return {
        title: {
            default: "CrepenCDN Admin",
            template: "CrepenCDN Admin | %s"
        },
        description: "Crepen CDN Admin",
        openGraph: {
            type: 'website',
            title: "CrepenCDN Admin",
        },
        icons: urlJoin('/resource/image/favicon.svg')
    }
}

export const viewport: Viewport = {
    userScalable: false
}

const GlobalLayout = async (prop: PropsWithChildren) => {

    if (process.env.NODE_ENV === 'development') {
        await LocaleProvider.getInstance().loadLocaleData(true);
    }
    else {
        await LocaleProvider.getInstance().loadLocaleData();
    }


    return (
        <html>
            <body>
                {prop.children}
            </body>
        </html>
    )
}


export default GlobalLayout;