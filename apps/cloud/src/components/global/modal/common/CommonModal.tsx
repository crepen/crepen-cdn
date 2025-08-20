'use client'

import { StringUtil } from "@web/lib/util/StringUtil"
import { PropsWithChildren, RefObject, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

export interface CommonModalProp {
    className?: string,
    isOpen?: boolean,
    onClose?: () => void,
    buttonRef?: RefObject<HTMLButtonElement | null>
}

export const CommonModal = (prop: PropsWithChildren<CommonModalProp>) => {

    const [winObj, setWinObj] = useState<Window | undefined>(undefined);
    const modalRef = useRef<HTMLDivElement>(null);


    const backdropClickCloseEventHandler = (event: MouseEvent) => {

        if (
            (modalRef.current && !modalRef.current.contains(event.target as Node))
            && (prop.buttonRef?.current && !prop.buttonRef?.current.contains(event.target as Node))
        ) {
            if (prop.onClose) prop.onClose();
        }
    }

    useEffect(() => {
        setWinObj(window);

        window.addEventListener('click', backdropClickCloseEventHandler);

        return (() => {
            window.removeEventListener('click', backdropClickCloseEventHandler);
        })
    }, [])

    return winObj && prop.isOpen && createPortal(
        <div
            className={StringUtil.joinClassName("cp-global-modal", prop.className)}
            ref={modalRef}

        >
            <div className="cp-modal-box">
                {prop.children}
            </div>
        </div>,
        winObj.document.body
    )
}


const CommonModalHeader = (prop: PropsWithChildren) => {
    return (
        <div className="cp-modal-header">
            {prop.children}
        </div>
    )
}

const CommonModalContent = (prop: PropsWithChildren) => {
    return (
        <div className="cp-modal-content">
            {prop.children}
        </div>
    )
}

const CommonModalFooter = (prop: PropsWithChildren) => {
    return (
        <div className="cp-modal-footer">
            {prop.children}
        </div>
    )
}



CommonModal.Header = CommonModalHeader;
CommonModal.Content = CommonModalContent;
CommonModal.Footer = CommonModalFooter;
