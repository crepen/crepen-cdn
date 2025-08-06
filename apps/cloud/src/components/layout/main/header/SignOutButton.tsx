'use client'

import { faHome, faSignOut } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { SignOutAction } from "@web/lib/actions/AuthActions";
import { useRouter } from "next/navigation"

export const SignOutButton = () => {

    const router = useRouter();

    return (
        <button
            className='cp-main-header-bt cp-signout-bt'
            onClick={async () => {
                await SignOutAction();
                router.refresh()
            }}
            type='button'
        >
            <FontAwesomeIcon icon={faSignOut} />
        </button>
    )
}