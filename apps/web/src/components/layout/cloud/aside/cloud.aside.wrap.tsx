'use client'

import { CloudGlobalAsideExpandState } from '@web/lib/state/cloud.global.state';
import { StringUtil } from '@web/lib/util/string.util';
import { useAtom, useAtomValue } from 'jotai';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';
import { PropsWithChildren, useEffect, } from 'react'


interface CloudGlobalAsideWrapProp extends PropsWithChildren {
    className?: string
}

export const CloudGlobalAsideWrap = (prop: CloudGlobalAsideWrapProp) => {

    const [expandState , setState] = useAtom(CloudGlobalAsideExpandState);

    const ss = usePathname();

    useEffect(() => {
        setState(false)
    }, [ss])

    return (
        <div
            className={prop.className}
            data-expand={expandState}
        >
            {prop.children}
        </div>
    );
}