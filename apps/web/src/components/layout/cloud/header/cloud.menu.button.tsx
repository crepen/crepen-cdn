'use client'

import { faBars } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { CloudGlobalAsideExpandState } from "@web/lib/state/cloud.global.state"
import { useAtom, useSetAtom } from "jotai"

export const CloudHeaderMenuButton = () => {

    const [state ,setState] = useAtom(CloudGlobalAsideExpandState)

    

    return (
        <button className="cp-menu-bt">
            <FontAwesomeIcon icon={faBars} className='cp-action-icon' onClick={() => setState(!state)}/>
        </button>
    )
}


