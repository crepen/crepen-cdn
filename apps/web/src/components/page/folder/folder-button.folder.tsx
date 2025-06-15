'use client'

import { CrepenFolder } from "@web/services/types/object/folder.object"
import Link from "next/link"

interface FolderObjectButtonProp {
    folderInfo: CrepenFolder,
    folderBaseUrl: string
}

export const FolderObjectButton = (prop: FolderObjectButtonProp) => {

    return (
        <Link
            className="cp-folder-button"
            data-folder-uid={prop.folderInfo.uid}
            // href={new URL('./' + prop.folderInfo.uid, prop.folderBaseUrl)}
            href={`/explorer/folder/${prop.folderInfo.uid}`}
            prefetch={false}
        >
            <span className="cp-folder-title">{prop.folderInfo.folderTitle}</span>
        </Link>
    )
}