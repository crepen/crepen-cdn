'use client'

import { SignCommonForm } from "../common/SignCommonForm"

export const SignUpForm = () => {
    return (
        <SignCommonForm
            className="cp-signup-form"
        >
            <SignCommonForm.Input 
                labelText="Name"
            />
            <SignCommonForm.Input 
                labelText="ID"
            />
            <SignCommonForm.Input 
                labelText="Password"
            />
            <SignCommonForm.Input 
                labelText="Check Password"
            />
            <SignCommonForm.Input 
                labelText="Email"
            />

            <SignCommonForm.Submit>
                Sign Up
            </SignCommonForm.Submit>
        </SignCommonForm>
    )
}