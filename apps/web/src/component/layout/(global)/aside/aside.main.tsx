'use server'

import './aside.main.scss'

import { StringUtil } from "@web/lib/util/string.util"
import Image from "next/image"
import LogoImage from '@web/assets/img/crepen-cdn-logo.png';
import { faDashboard, faSignOut, faUser } from '@fortawesome/free-solid-svg-icons';
import { MainAsideMenuLinkItem } from './item/link.aside-item.main';
import { CollapseMainAsideMenuItem } from './item/collapse.aside-item.main';
import { ExplorerMainAsideLinkMenuItem } from './item/explorer.aside-item.main';
import { ServerI18nProvider } from '@web/modules/server/i18n/ServerI18nProvider';

interface MainAsideProp {
    className?: string
}

export const MainAside = async (prop: MainAsideProp) => {

    return (
        <aside className={StringUtil.joinClassName("cp-aside", prop.className)}>
            <div className="cp-aside-box">
                <div className="cp-aside-header">
                    <Image
                        src={LogoImage}
                        alt='logo'
                        className='cp-logo-img'
                        width={100}
                    />
                </div>
                {/* <hr /> */}
                <div className='cp-aside-menu'>
                    <hr />
                    <div className='cp-aside-menu-category'>
                        <MainAsideMenuLinkItem
                            link='/'
                            title={await ServerI18nProvider.getSystemTranslationText('layout.aside.MENU_LABEL_DASHBOARD') ?? 'Dashboard'}
                            icon={faDashboard}
                        />
                        <ExplorerMainAsideLinkMenuItem />
                    </div>
                    <hr />
                </div>
                {/* <hr /> */}
                <div className='cp-aside-footer'>
                    <CollapseMainAsideMenuItem />
                    <MainAsideMenuLinkItem
                        link='/profile'
                        title='Profile'
                        icon={faUser}
                    />
                    <MainAsideMenuLinkItem
                        link='/logout'
                        title='Logout'
                        icon={faSignOut}
                    />
                </div>
            </div>
        </aside>
    )
}

