'use client'

import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRouter } from "next/navigation"

export const MoveHomeButton = () => {

    const router = useRouter();

    return (
        <button
            className='cp-main-header-bt cp-move-home-bt'
            onClick={() => {
                router.push('/')
            }}
            type='button'
        >
            <FontAwesomeIcon icon={faHome} />
        </button>
    )
}