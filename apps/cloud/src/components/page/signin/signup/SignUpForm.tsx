'use client'

import { useMemo, useRef, useState } from "react"
import { SignCommonForm } from "../common/SignCommonForm"
import { AddUserAction } from "@web/lib/actions/UserActions";
import { useRouter } from "next/navigation";

export const SignUpForm = () => {

    const route = useRouter();

    const userIdRef = useRef<HTMLInputElement>(null);
    const userPasswordRef = useRef<HTMLInputElement>(null);
    const userEmailRef = useRef<HTMLInputElement>(null);
    const userNameRef = useRef<HTMLInputElement>(null);
    const checkPasswordRef = useRef<HTMLInputElement>(null);

    const [isLoading, setLoadState] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

    useMemo(() => { if (isLoading) setErrorMessage(undefined) }, [isLoading])

    const applyUser = async () => {
        setLoadState(true);

        const res = await AddUserAction(
            userIdRef.current?.value,
            userPasswordRef.current?.value,
            userNameRef.current?.value,
            userEmailRef.current?.value,
            checkPasswordRef.current?.value
        );

        if(res.success){
            alert(res.message);
            route.replace('/signin')
        }
        else{
            setErrorMessage(res.message);
        }

        setLoadState(false);
    }

    return (
        <SignCommonForm
            className="cp-signup-form"
        >
            <SignCommonForm.Input
                labelText="Name"
                inputRef={userNameRef}
            />
            <SignCommonForm.Input
                labelText="ID"
                inputRef={userIdRef}
            />
            <SignCommonForm.Input
                labelText="Password"
                inputRef={userPasswordRef}
                inputType="password"
            />
            <SignCommonForm.Input
                labelText="Check Password"
                inputRef={checkPasswordRef}
                inputType="password"
            />
            <SignCommonForm.Input
                labelText="Email"
                inputRef={userEmailRef}
            />

            <SignCommonForm.Submit
                activeLoading={isLoading}
                onClick={() => applyUser()}
                buttonType="button"
            >
                Sign Up
            </SignCommonForm.Submit>

            <SignCommonForm.ErrorBox
                message={errorMessage}
            />

        </SignCommonForm>
    )
}