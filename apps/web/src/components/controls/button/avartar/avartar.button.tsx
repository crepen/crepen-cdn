import { StringUtil } from '@web/lib/util/string.util'
import './avartar.button.scss'
import { MouseEventHandler, RefObject } from 'react'


interface AvartarIconButtonProp {
    className?: string,
    onClick: MouseEventHandler<HTMLButtonElement>,
    ref? : RefObject<HTMLButtonElement | null>
}

/** @deprecated */
export const AvartarIconButton = (prop: AvartarIconButtonProp) => {
    return (
        <button
            className={StringUtil.joinClassName('cp-button cp-avartar-bt', prop.className)}
            onClick={prop.onClick}
            ref={prop.ref}
        >
            DS
        </button>
    )
}