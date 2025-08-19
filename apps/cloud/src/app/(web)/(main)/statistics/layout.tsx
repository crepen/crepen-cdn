import '@web/assets/styles/page/main/statistics/statistics.main.layout.scss';
import { LocaleConfig } from '@web/lib/config/LocaleConfig';
import { ServerLocaleProvider } from '@web/lib/module/locale/ServerLocaleProvider';
import { Metadata } from 'next';

import { PropsWithChildren } from "react"
import { FcRight } from 'react-icons/fc';



export const generateMetadata = async () : Promise<Metadata> => {
     const localeProv = ServerLocaleProvider.current(LocaleConfig);

    return {
        title : await localeProv.translate('title.statistics')
    }
}



const StatisticsLayout = (prop : PropsWithChildren) => {
    return (
        <div className="cp-side-layout cp-statistics-layout">
            <div className="cp-header">
                <div className='cp-top-header'>
                    <div className='cp-flex-left'>
                        <FcRight />
                    </div>
                    <div className='cp-flex-right'>

                    </div>
                </div>
                <div className='cp-toolbar-header'>

                </div>
            </div>
            <div className="cp-content">
                {prop.children}
            </div>
        </div>
    )
}

export default StatisticsLayout;