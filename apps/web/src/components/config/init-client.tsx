'use client'

import { Fragment, PropsWithChildren, useEffect } from 'react'
import { useScreenSize } from './calc-screen'
import { useGlobalBasePath } from '@web/lib/state/global.state'

interface InitClientProp extends PropsWithChildren {
    basePath?: string
}

export const InitClient = (prop: InitClientProp) => {

    useScreenSize();

    const basePath = useGlobalBasePath();


    useEffect(() => {
        basePath.update(prop.basePath);
    }, [])




    return (
        <Fragment>
            {prop.children}
        </Fragment>

    )
}