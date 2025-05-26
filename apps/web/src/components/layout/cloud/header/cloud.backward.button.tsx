'use client'

import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRouter } from "next/navigation"

export const CloudHeaderBackwardButton = () => {

    const router = useRouter();

    return (
        <button className="cp-backward-bt">
            <FontAwesomeIcon icon={faArrowLeft} className='cp-action-icon' onClick={() => router.back()} />
        </button>
    )
}