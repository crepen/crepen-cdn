'use client'

import { Fragment, PropsWithChildren, useEffect } from 'react'
import { useScreenSize } from './calc-screen'
import { useGlobalBasePath, useGlobalLanguage } from '@web/lib/state/global.state'

interface InitClientProp extends PropsWithChildren {
    basePath?: string,
    language?: string
}

/** @deprecated */
export const InitClient = (prop: InitClientProp) => {

    useScreenSize();

    const basePath = useGlobalBasePath();
    const globalLanguage = useGlobalLanguage();


    useEffect(() => {
        basePath.update(prop.basePath);
        console.log(prop.basePath)
    }, [])

    useEffect(() => {
        // globalLanguage.update(prop.language);
    }, [prop.language])




    return (
        <Fragment>
            {prop.children}
        </Fragment>

    )
}