'use client'

import { PropsWithChildren, useEffect, useRef } from "react"
import { MainHeaderMenuType } from "../../../../app/(main)/layout"
import { useClientLocale } from "@web/lib/module/locale/ClientLocaleProvider"
import { MainHeaderLinkMenu } from "../header/MainHeaderMenu"
import { FaCircleUser } from "react-icons/fa6"
import { StringUtil } from "@web/lib/util/StringUtil"
import { useMainAsideState } from "../provider/MainAsideStateProvider"
import { SignOutAction } from "@web/lib/actions/AuthActions"
import { useRouter } from "next/navigation"

interface MainMobileMenuProp extends PropsWithChildren {
    menuList: MainHeaderMenuType[]
}

export const MainMobileMenu = (prop: MainMobileMenuProp) => {

    const localeHook = useClientLocale();
    const asideHook = useMainAsideState();
    const asideRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const closeEventHandler = (event: MouseEvent) => {
        if (asideRef.current && !asideRef.current.contains(event.target as Node)) {
            asideHook.setState(false);
        }
    }

    const signOutEventHandler = async () => {
        void await SignOutAction();
        router.refresh();
    }

    useEffect(() => {
        window.addEventListener('mousedown', closeEventHandler)
        return (() => {
            window.removeEventListener('mousedown', closeEventHandler)
        })
    }, [])

    return (
        <aside
            className={
                StringUtil.joinClassName(
                    'cp-mobile-menu',
                    asideHook.state ? 'active' : undefined)
            }
            ref={asideRef}
        >

            <div className='cp-mobile-menu-list'>
                {
                    prop.menuList.map((x, idx) => (
                        <MainHeaderLinkMenu
                            key={idx}
                            title={x.title}
                            icon={x.icon}
                            className={x.className}
                            link={x.link}
                        />
                    ))
                }
            </div>

            <div className='cp-mobile-menu-footer'>
                <MainHeaderLinkMenu
                    title={localeHook.translate('layout.main.common.profile')}
                    icon={<FaCircleUser className='cp-nav-icon' />}
                    className={'cp-nav-profile'}
                    link={'/profile'}
                />

                <button className='cp-mobile-menu-button cp-signout-bt'
                    onClick={signOutEventHandler}
                >
                    {localeHook.translate('layout.main.common.signout')}
                </button>
            </div>
        </aside>
    )
}