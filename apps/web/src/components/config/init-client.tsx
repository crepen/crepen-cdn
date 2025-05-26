'use client'

import { Fragment, PropsWithChildren } from 'react'
import { useScreenSize } from './calc-screen'

interface InitClientProp extends PropsWithChildren {

}

export const InitClient = (prop: InitClientProp) => {

    useScreenSize();


    return (
        <Fragment>
            {prop.children}
        </Fragment>

    )
}