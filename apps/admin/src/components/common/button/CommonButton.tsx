'use client'

import { MouseEventHandler, PropsWithChildren } from "react"
import { ImSpinner2 } from "react-icons/im"
import { StringUtil } from "../../../libs/util/StringUtil"

interface CommonButtonProp {
    className?: string,
    onClick?: MouseEventHandler<HTMLButtonElement>,
    type?: 'submit' | 'secondary' | 'danger',
    isLoading?: boolean
}

export const CommonButton = (prop: PropsWithChildren<CommonButtonProp>) => {
    return (
        <button
            className={
                StringUtil.joinClassName(
                    "cp-control",
                    "cp-button",
                    `cp-${prop.type ?? 'secondary'}`,
                    prop.className,
                    prop.isLoading ? 'cp-loading' : ''
                )
            }
            onClick={prop.onClick}
        >
            <div className="cp-button-content">
            {prop.children}
            </div>
            <div className="cp-loading-spinner">
                <ImSpinner2 size={20} />
            </div>
        </button>
    )
}