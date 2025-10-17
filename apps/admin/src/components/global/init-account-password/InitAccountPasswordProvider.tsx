'use client'

import {Fragment, useEffect, useState} from 'react'
import { createPortal } from 'react-dom';
import { InitAccountPasswordModal } from './InitAccountPasswordModal';

interface InitAccountPasswordProviderProp {
    isInitPassword : boolean
}

export const InitAccountPasswordProvider = (prop : InitAccountPasswordProviderProp) => {

    const [winObj , setWinObj] = useState<Window | undefined>(undefined);

    useEffect(() => {
        setWinObj(window);
    },[])

    return !prop.isInitPassword && (
        <Fragment>
            {
                winObj && createPortal(
                    <InitAccountPasswordModal isOpen/>,
                    winObj.document.body
                )
            }
        </Fragment>
    )
}