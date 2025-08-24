import '@web/assets/styles/layout/main.layout.scss';
import { MainHeader } from '@web/component/layout/main/header/MainHeader';
import { MainMobileMenu } from '@web/component/layout/main/mobile-menu/MainMobileMenu';
import { MainAsideStateProvider } from '@web/component/layout/main/provider/MainAsideStateProvider';
import { MainUploadFileModalProvider } from '@web/component/layout/main/provider/MainUploadFileModalProvider';
import { MainUploadFileProvider } from '@web/component/layout/main/provider/MainUploadFileProvider';
import { LocaleConfig } from '@web/lib/config/LocaleConfig';
import { ServerLocaleProvider } from '@web/lib/module/locale/ServerLocaleProvider';

import { PropsWithChildren, ReactNode, Suspense } from "react";
import { FcComboChart, FcOpenedFolder, FcStatistics } from 'react-icons/fc';


export type MainHeaderMenuType = {
    title?: string,
    icon?: ReactNode,
    className?: string,
    link?: string,
    matchUrl?: string
}


const MainDefaultLayout = async (prop: PropsWithChildren) => {


    const translateProv = ServerLocaleProvider.current(LocaleConfig);

    const mainHeaderMenuList: MainHeaderMenuType[] = [
        {
            title: await translateProv.translate('layout.main.navigation.menu.dashboard'),
            icon: <FcComboChart className='cp-nav-icon' />,
            className: 'cp-nav-dashboard',
            link: '/dashboard'
        },
        {
            title: await translateProv.translate('layout.main.navigation.menu.explorer'),
            icon: <FcOpenedFolder className='cp-nav-icon' />,
            className: "cp-nav-explorer",
            link: '/explorer/root',
            matchUrl : '/explorer'
        },
        {
            title: await translateProv.translate('layout.main.navigation.menu.statistics'),
            icon: <FcStatistics className='cp-nav-icon' />,
            className: "cp-nav-explorer",
            link: '/statistics'
        }
    ]

    return (

        <MainUploadFileProvider>
            <MainUploadFileModalProvider>
                <MainAsideStateProvider>
                    <div className="cp-internal-layout cp-layout cp-main-layout">
                        <MainHeader
                            menuList={mainHeaderMenuList}
                        />
                        <main>
                            <Suspense fallback={<div>LOADING</div>}>
                                {prop.children}
                            </Suspense>
                        </main>
                        <MainMobileMenu menuList={mainHeaderMenuList} />

                    </div>
                </MainAsideStateProvider>
            </MainUploadFileModalProvider>
        </MainUploadFileProvider>
    )
}

export default MainDefaultLayout;