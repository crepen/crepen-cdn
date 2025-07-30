'use client'

import { faAnglesLeft } from "@fortawesome/free-solid-svg-icons"
import { MainAsideMenuItem } from "./common.aside-item.main"
import { useGlobalAsideExpandState } from "@web/lib/zustand-state/cloud.global.state";


export const CollapseMainAsideMenuItem = () => {

    const expandState = useGlobalAsideExpandState();

    return (
        <MainAsideMenuItem
            icon={faAnglesLeft}
            title='Collapse'
            onClick={() => {
                expandState.toggle(!expandState.state);
            }}
            className="cp-aside-expand-bt"
        />
    )
}