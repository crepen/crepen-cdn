'use client'

import { Fragment, useEffect, useRef, useState } from "react"
import { MainProfileToast } from "./profile-toast";

export const ProfileButton = () => {


    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const toastRef = useRef<HTMLDivElement>(null);

    const [toastPosition, setToastPosition] = useState<{ left: number, bottom: number }>({ left: 0, bottom: 0 })

    const buttonClickHandler = () => {
        if (!toastRef.current?.classList.contains('cp-active')) {
            toastRef.current?.classList.add('cp-active');
        }
        toastRef.current?.classList.toggle('cp-show');
    }

    useEffect(() => {
        setToastPosition({
            left: (buttonRef.current?.offsetLeft ?? 0) + (buttonRef.current?.clientWidth ?? 0) + 40,
            bottom: window.innerHeight - (buttonRef.current?.offsetTop ?? 0) - (buttonRef.current?.offsetHeight ?? 0)
        })
    }, [])

    return (
        <Fragment>
            <button
                className="cp-button cp-profile-bt cp-icon-button"
                onClick={buttonClickHandler}
                ref={buttonRef}
            >
                PRO
            </button>

            <MainProfileToast
                position={toastPosition}
                ref={toastRef}
            />

        </Fragment>
    )
}