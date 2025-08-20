'use client'

import Link from "next/link"

export const SignInResetPasswordButton = () => {
    return (
        <Link 
            className="cp-action-button"
            href={'/signin/find/password'}
        >
            Find Password
        </Link>
    )
}