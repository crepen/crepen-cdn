'use client'

import { useGlobalAsideExpandState } from '@web/lib/state/cloud.global.state';
import { usePathname } from 'next/navigation';
import { PropsWithChildren, useEffect, } from 'react'


interface CloudGlobalAsideWrapProp extends PropsWithChildren {
    className?: string
}

export const CloudGlobalAsideWrap = (prop: CloudGlobalAsideWrapProp) => {

    const expandState = useGlobalAsideExpandState();
    const pathname = usePathname();

    useEffect(() => {
        expandState.toggle(false)
    }, [pathname])


    useEffect(() => {
        console.log('EXPAND_STATE',expandState);
    },[expandState])


    return (
        <div
            className={prop.className}
            data-expand={expandState.state}
        >
            {prop.children}
        </div>
    );
}