import Image from "next/image"
import { SignOutButton } from "./SignOutButton"
import { BasePathInitializer } from "@web/lib/module/basepath/BasePathInitializer"
import { headers } from "next/headers"
import urlJoin from "url-join"
import { LocaleConfig } from "@web/lib/config/LocaleConfig"
import { ServerLocaleProvider } from "@web/lib/module/locale/ServerLocaleProvider"
import { FcComboChart, FcOpenedFolder } from "react-icons/fc"
import { MainHeaderMenu } from "./MainHeaderMenu"
import Link from "next/link"

export const MainHeader = async () => {

    const basePath = await BasePathInitializer.get({ readHeader: await headers() });
    const translateProv = ServerLocaleProvider.current(LocaleConfig);

    return (
        <header>
            <Link href={'/'} className="cp-header-box cp-logo-box">
                <Image
                    src={urlJoin(basePath, '/resource/image/logo.png')}
                    width={197}
                    height={66}
                    alt="Logo Image"
                    className="cp-logo"
                />
            </Link>
            <div className="cp-header-box cp-nav-box">
                <MainHeaderMenu
                    title={await translateProv.translate('layout.main.navigation.menu.dashboard')}
                    icon={<FcComboChart className='cp-nav-icon' />}
                    className="cp-nav-dashboard"
                    link={'/dashboard'}
                />
                <MainHeaderMenu
                    title={await translateProv.translate('layout.main.navigation.menu.explorer')}
                    icon={<FcOpenedFolder className='cp-nav-icon' />}
                    className="cp-nav-explorer"
                    link={'/explorer'}
                />
            </div>
            <div className="cp-header-box cp-profile-box">
                <button className="cp-profile-bt cp-header-action-bt">
                    Profile
                </button>
                <SignOutButton />
            </div>
        </header>
    )
}