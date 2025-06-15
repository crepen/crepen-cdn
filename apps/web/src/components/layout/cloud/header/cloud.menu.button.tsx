'use client'

import { faBars } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useGlobalAsideExpandState } from "@web/lib/state/cloud.global.state"

export const CloudHeaderMenuButton = () => {

    const expandState = useGlobalAsideExpandState();

    

    return (
        <button className="cp-menu-bt">
            <FontAwesomeIcon icon={faBars} className='cp-action-icon' onClick={() => expandState.toggle(!expandState.state)}/>
        </button>
    )
}


