'use client'

import { BaseHeaderIconButton } from "./base.icon-button.header.main"
import { faBars } from "@fortawesome/free-solid-svg-icons"
import { StringUtil } from "@web/lib/util/string.util"
import { useGlobalAsideExpandState } from "@web/modules/client/state/cloud.global.state"

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