'use client'

import { faTurnUp } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { StringUtil } from "@web/lib/util/string.util"
import { useRouter } from "next/navigation"
import { Fragment } from 'react'

interface MoveParentFolderButtonProp {
    parentUid?: string,
    folderBaseUrl? : string
}


export const MoveParentFolderButton = (prop: MoveParentFolderButtonProp) => {
    const route = useRouter();

    const clickHandler = () => {
        console.log('?')
        route.push(new URL(prop.parentUid ?? '' , prop.folderBaseUrl ?? '/').toString())
    }

    return (
        <Fragment>
            {
                StringUtil.isEmpty(prop.parentUid)
                    ? <Fragment />
                    : <button onClick={clickHandler} >
                        <FontAwesomeIcon icon={faTurnUp} flip="horizontal" />
                        <span>Move Parent Folder</span>
                    </button>
            }
        </Fragment>

    )
}