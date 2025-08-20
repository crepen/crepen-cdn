'use client'

import Link from "next/link"

export const SignInFindIdButton = () => {
    return (
        <Link 
            className="cp-action-button"
            href={'/signin/find/id'}
        >
            Find ID
        </Link>
    )
}