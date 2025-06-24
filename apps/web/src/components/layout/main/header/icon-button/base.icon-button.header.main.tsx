import './base.icon-button.header.main.scss'

import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { StringUtil } from '@web/lib/util/string.util'
import { DOMAttributes, MouseEventHandler } from 'react'

interface BaseHeaderIconButtonProp {
    icon: IconProp,
    onClick?: MouseEventHandler<HTMLButtonElement> | undefined,
    className? : string
}

export const BaseHeaderIconButton = (prop: BaseHeaderIconButtonProp) => {

    const divOptions: DOMAttributes<HTMLButtonElement> = {}

    if (prop.onClick !== undefined) {
        divOptions.onClick = (e) => prop.onClick!(e);
    }


    return (
        <button
            {...divOptions}
            className={StringUtil.joinClassName("cp-header-icon-bt" , prop.className)}
        >
            <FontAwesomeIcon icon={prop.icon} />
        </button>
    )
}