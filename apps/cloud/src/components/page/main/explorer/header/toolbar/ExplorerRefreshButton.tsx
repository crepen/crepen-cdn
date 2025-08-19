'use client'

import { useRouter } from "next/navigation"
import { HiOutlineRefresh } from "react-icons/hi";


export const ExplorerRefreshButton = () => {

    const router = useRouter();

    return (
        <button
            className='cp-header-bt cp-refresh-bt cp-header-icon-bt'
            onClick={() => {
                router.refresh();
            }}
        >
            <div className="cp-button-icon">
            <HiOutlineRefresh size={20}/>
            </div>
        </button>
    )
}