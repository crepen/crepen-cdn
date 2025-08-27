'use client'

import { StringUtil } from "@web/lib/util/StringUtil"
import { useRouter } from "next/navigation"
import { FcHome, FcLeft } from "react-icons/fc"
import { IoHomeSharp } from "react-icons/io5"

interface HistoryBackButtonProp {
    className?: string,
    moveFolderUid?: string
}

export const HistoryBackButton = (prop: HistoryBackButtonProp) => {

    const router = useRouter();

    return (
        <button
            className={StringUtil.joinClassName(prop.className)}
            onClick={() => {
                if (prop.moveFolderUid !== 'root') {
                    router.push(`/explorer/folder/${prop.moveFolderUid ?? 'root'}`)
                }
            }}
        >
            {
                prop.moveFolderUid === 'root'
                    ? <IoHomeSharp />
                    : <FcLeft />
            }

        </button>
    )
}