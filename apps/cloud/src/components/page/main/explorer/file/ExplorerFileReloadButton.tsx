'use client'

import { useRouter } from "next/navigation"
import { FcRefresh } from "react-icons/fc"

export const ExplorerFileReloadButton = () => {
    const route = useRouter()

    return (
        <button
            className='cp-action-button'
            onClick={() => {
                route.refresh();
            }}
        >
            <div className='cp-button-icon'>
                <FcRefresh fontSize={20} />
            </div>
            <div className='cp-button-text'>
                Reload Data
            </div>
        </button>
    )
}