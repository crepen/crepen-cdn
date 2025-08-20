'use client'

import Link from "next/link"

export const SignInSignUpButton = () => {
    return (
        <Link
            className="cp-signup-button"
            href={'/signin/signup'}
        >
            Sign Up
        </Link>
    )
}