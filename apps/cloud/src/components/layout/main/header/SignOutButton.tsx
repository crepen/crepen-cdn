'use client'

import { SignOutAction } from "@web/lib/actions/AuthActions";
import { useRouter } from "next/navigation"

export const SignOutButton = () => {

    const router = useRouter();

    return (
        <button
            className='cp-header-action-bt cp-signout-bt'
            onClick={async () => {
                await SignOutAction();
                router.refresh()
            }}
            type='button'
        >
            Logout
        </button>
    )
}