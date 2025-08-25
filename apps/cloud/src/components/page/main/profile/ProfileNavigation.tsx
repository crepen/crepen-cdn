'use client'

import { useClientBasePath } from "@web/lib/module/basepath/ClientBasePathProvider"
import { StringUtil } from "@web/lib/util/StringUtil"
import { UrlUtil } from "@web/lib/util/UrlUtil"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { PropsWithChildren, ReactNode, useEffect, useState } from "react"

export const ProfileNavigation = (prop: PropsWithChildren) => {
    return (
        <div className="cp-profile-navigation">
            {prop.children}
        </div>
    )
}

interface ProfileNavigationItemProp {
    title: string,
    icon?: ReactNode,
    link?: string
}


export const ProfileNavigationItem = (prop: ProfileNavigationItemProp) => {

    const basePathHook = useClientBasePath();
    const pathNameHook = usePathname();

    const [isActive, setActiveState] = useState<boolean>(false);

    useEffect(() => {
        if (UrlUtil.isMatchPattern(location.href, `${prop.link ?? ''}/*`, { basePath: basePathHook.getBasePath() })) {
            setActiveState(true);
        }
        else {
            setActiveState(false);
        }
    }, [pathNameHook])

    return (
        <Link
            href={prop.link ?? '#'}
            className={StringUtil.joinClassName("cp-nav-button", isActive ? 'cp-active' : '')}
        >
            {
                prop.icon &&
                <div className="cp-nav-icon">
                    {prop.icon}
                </div>
            }
            <div className="cp-nav-title">
                {prop.title}
            </div>
        </Link>
    )
}
