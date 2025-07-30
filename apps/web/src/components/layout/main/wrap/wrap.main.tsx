'use client'

import { StringUtil } from "@web/lib/util/string.util"
import { useGlobalAsideExpandState } from "@web/lib/zustand-state/cloud.global.state"
import { usePathname } from "next/navigation"
import { PropsWithChildren, useEffect } from "react"

interface MainWrapperProp extends PropsWithChildren {
    className?: string
}

export const MainWrapper = (prop: MainWrapperProp) => {

    const expandAside = useGlobalAsideExpandState();
    const pathname = usePathname();


    const onPageMoveEventHandler = () => {
        expandAside.toggle(false);
    }

    useEffect(() => {
        onPageMoveEventHandler();
    }, [pathname])

    return (
        <div
            className={StringUtil.joinClassName(prop.className)}
            data-aside-expand={expandAside.state ? 'expand' : 'collapse'}
        >
            {prop.children}
        </div>
    );
}