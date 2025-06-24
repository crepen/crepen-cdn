'use client'

import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { BaseHeaderIconButton } from "./base.icon-button.header.main"
import { faBars } from "@fortawesome/free-solid-svg-icons"
import { useGlobalAsideExpandState } from "@web/lib/state/cloud.global.state"
import { DOMAttributes, MouseEventHandler } from "react"
import { StringUtil } from "@web/lib/util/string.util"

interface ExpandAsideHeaderIconButtonProp {
    className? : string
}

export const ExpandAsideHeaderIconButton = (prop : ExpandAsideHeaderIconButtonProp) => {

    const expandState = useGlobalAsideExpandState();

    
    const onClickEventHandler = () => {
        expandState.toggle(!expandState.state);
    }

    return (
        <BaseHeaderIconButton
            icon={faBars}
            onClick={onClickEventHandler}
            className={StringUtil.joinClassName(prop.className , 'cp-expand-bt')}
        />
    )
}