'use client'

import { StringUtil } from "@web/lib/util/StringUtil"
import { MouseEvent, ReactNode, RefObject } from "react"

interface MainHeaderMenuProp {
    className?: string,
    icon: ReactNode,
    text: string,
    mode?: 'only-icon' | 'only-text' | 'both',
    onClick? : (e : MouseEvent) => void,
    ref? : RefObject<HTMLButtonElement | null>,
    onMouseDown? : (e : MouseEvent) => void
} 

export const MainHeaderActionButton = (prop: MainHeaderMenuProp) => {
    return (
        <button
            className={StringUtil.joinClassName("cp-header-action-bt", prop.className)}
            data-mode={prop.mode ?? 'both'}
            onClick={prop.onClick}
            onMouseDown={prop.onMouseDown}
            ref={prop.ref}
        >
            <div className="cp-button-icon">
                {prop.icon}
            </div>
            <div className="cp-button-text">
                {prop.text}
            </div>
        </button>
    )
}