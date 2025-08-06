'use client'

import './ChangeLocaleButton.scss'

import { faLanguage } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ChangeLocaleAction } from '@web/lib/actions/LocaleActions'
import { useClientLocale } from '@web/lib/module/locale/ClientLocaleProvider'
import { useRouter } from 'next/navigation'
import { Fragment, MouseEvent, RefObject, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { createPortal } from 'react-dom'


interface ChangeLocaleButtonRef {
    changeState: (state: boolean) => void
}

export const ChangeLocaleButton = () => {
    const componentRef = useRef<ChangeLocaleButtonRef>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [openMenuState, setOpenMenuState] = useState<boolean>(false);
    const [dropMenuElement, setDropMenuElement] = useState<Element | null>(null);


    useImperativeHandle(componentRef, () => ({
        changeState: (state: boolean) => {
            setOpenMenuState(state);
        },
    }))



    const onClickEventHandler = (e: MouseEvent<HTMLButtonElement>) => {
        setOpenMenuState(!openMenuState);
    }

    useEffect(() => {
        if (openMenuState === true) {
            setDropMenuElement(document.body);
        }
    }, [openMenuState])

    return (
        <Fragment>
            <button
                className='cp-main-header-bt cp-change-locale-bt'
                onClick={onClickEventHandler}
                type='button'
                ref={buttonRef}
            >
                <FontAwesomeIcon icon={faLanguage} />
            </button>
            {
                (openMenuState && dropMenuElement) &&
                createPortal(
                    <ChangeLocaleDropMenu
                        isOpen={openMenuState}
                        top={(buttonRef.current?.offsetTop ?? 0) + (buttonRef.current?.offsetHeight ?? 0)}
                        right={(buttonRef.current?.clientLeft ?? 0) + (buttonRef.current?.offsetWidth ?? 0)}
                        buttonComponentRef={componentRef}
                    />,
                    dropMenuElement
                )
            }

        </Fragment>



    )
}

interface ChangeLocaleDropMenuProp {
    isOpen: boolean,
    top?: number,
    bottom?: number,
    left?: number,
    right?: number,
    buttonComponentRef?: RefObject<ChangeLocaleButtonRef | null>
}



const ChangeLocaleDropMenu = (prop: ChangeLocaleDropMenuProp) => {

    const menuRef = useRef<HTMLDivElement>(null);

    const clientLocaleHook = useClientLocale();
    const router = useRouter();
    const translateHook = useClientLocale();


    const changeLocaleClickHandler = async (changeLocale : string) => {
        prop.buttonComponentRef?.current?.changeState(false);

        const changeLocaleResult = await ChangeLocaleAction(changeLocale);

        router.refresh();
    }




    useEffect(() => {

        const closeEventHandler = (e: globalThis.MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                prop.buttonComponentRef?.current?.changeState(false);
            }
        }

        window.addEventListener('mousedown', closeEventHandler);

        return (() => {
            prop.buttonComponentRef?.current?.changeState(false);
            window.removeEventListener('mousedown', closeEventHandler);
        })
    }, [])

    return (
        <div
            className='cp-drop-menu cp-change-locale-dropmenu'
            style={{
                top: prop.top,
                left: prop.left,
                bottom: prop.bottom,
                right: prop.right
            }}
            ref={menuRef}
        >
            <div className='cp-drop-list'>
                {
                    clientLocaleHook.getSupportLocale().map(locale => (
                        <div
                            key={locale}
                            className='cp-drop-item'
                            onClick={() => {
                                changeLocaleClickHandler(locale);
                            }}
                        >
                            {locale && translateHook.translate(`common.locale.${locale}`)}
                        </div>
                    ))
                }
               
            </div>
        </div>
    )
}