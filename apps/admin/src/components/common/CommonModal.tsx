'use client'

import {  MouseEventHandler, PropsWithChildren, useEffect, useRef, useState } from "react"
import { StringUtil } from "../../libs/util/StringUtil"
import { IoCloseSharp } from "react-icons/io5"
import { ImSpinner2 } from "react-icons/im"

export interface CommonModalProp {
    isOpen?: boolean,
    className?: string,
    disableDropClickClose?: boolean,
    onClose?: () => void
}

export const CommonModal = (prop: PropsWithChildren<CommonModalProp>) => {

    const modalBoxRef = useRef<HTMLDivElement>(null);

    const dropCloseClickEvent = (e: MouseEvent) => {
        if (!modalBoxRef.current?.contains(e.target as Node)) {
            if (prop.onClose) prop.onClose();
        }
    }

    useEffect(() => {
        window.addEventListener('click', dropCloseClickEvent);
        return (() => window.removeEventListener('click', dropCloseClickEvent))
    }, [])

    return (
        <div
            className={StringUtil.joinClassName(
                'cp-modal',
                prop.className,
                prop.isOpen === true ? 'cp-open' : ''
            )}
        >
            <div className="cp-modal-box" ref={modalBoxRef}>
                {prop.children}
            </div>

        </div>
    )
}



const CommonModalHeader = (prop: PropsWithChildren) => {
    return (
        <div className="cp-modal-header">
            {prop.children}
        </div>
    )
}

CommonModal.Header = CommonModalHeader;



const CommonModalContent = (prop: PropsWithChildren) => {
    return (
        <div className="cp-modal-content">
            {prop.children}
        </div>
    )
}

CommonModal.Content = CommonModalContent;

const CommonModalFooter = (prop: PropsWithChildren) => {
    return (
        <div className="cp-modal-footer">
            {prop.children}
        </div>
    )
}

CommonModal.Footer = CommonModalFooter;


interface CommonModalCloseButtonProp {
    iconSize?: number,
    onClick?: MouseEventHandler<HTMLButtonElement>
}

const CommonModalCloseButton = (prop: CommonModalCloseButtonProp) => {
    return (
        <button
            className="cp-modal-control cp-modal-close-bt"
            onClick={prop.onClick}
        >
            <IoCloseSharp size={prop.iconSize} />
        </button>
    )
}

CommonModal.CloseButton = CommonModalCloseButton;


interface CommonModalButtonProp {
    className?: string,
    onClick?: MouseEventHandler<HTMLButtonElement>,
    type?: 'submit' | 'secondary' | 'danger',
    isLoading?: boolean
}

const CommonModalButton = (prop: PropsWithChildren<CommonModalButtonProp>) => {

    return (
        <button
            className={
                StringUtil.joinClassName(
                    "cp-modal-control cp-modal-button",
                    `cp-${prop.type ?? 'secondary'}`,
                    prop.className,
                    prop.isLoading ? 'cp-loading' : ''
                )
            }
            onClick={prop.onClick}
        >
            {prop.children}
            <div className="cp-loading-spinner">
                <ImSpinner2 size={20}/>
            </div>
        </button>
    )
}


CommonModal.Button = CommonModalButton;