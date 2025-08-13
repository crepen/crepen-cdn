'use client'

import { StringUtil } from "@web/lib/util/StringUtil"
import { useRouter } from "next/navigation"
import { FcLeft } from "react-icons/fc"

interface HistoryBackButtonProp {
    className?: string
}

export const HistoryBackButton = (prop : HistoryBackButtonProp) => {

    const router = useRouter();

    return (
        <button 
            className={StringUtil.joinClassName(prop.className)}
            onClick={() => router.back()}
        >
            <FcLeft />
        </button>
    )
}