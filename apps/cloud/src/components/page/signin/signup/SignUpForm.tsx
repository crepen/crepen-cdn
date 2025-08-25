'use client'

import { useEffect, useMemo, useRef, useState } from "react"
import { SignCommonForm } from "../common/SignCommonForm"
import { AddUserAction } from "@web/lib/actions/UserActions";
import { useRouter } from "next/navigation";
import { SignUpStepper } from "./SignUpStepper";
import { createPortal } from "react-dom";
import { useClientBasePath } from "@web/lib/module/basepath/ClientBasePathProvider";
import urlJoin from "url-join";
import { RestUserDataValidateCheckCategory } from "@web/lib/types/api/dto/RestUserDto";
import { useClientLocale } from "@web/lib/module/locale/ClientLocaleProvider";
import { StringUtil } from "@web/lib/util/StringUtil";
import { SignUpData, useSignUpData } from "./SignUpDataProvider";

export const SignUpForm = () => {

    const route = useRouter();

    const signUpHook = useSignUpData();

    const userIdRef = useRef<HTMLInputElement>(null);
    const userPasswordRef = useRef<HTMLInputElement>(null);
    const userEmailRef = useRef<HTMLInputElement>(null);
    const userNameRef = useRef<HTMLInputElement>(null);
    const checkPasswordRef = useRef<HTMLInputElement>(null);


    const [isLoading, setLoadState] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
    const [winObj, setWinObj] = useState<Window | undefined>(undefined);

    const [nameError, setNameError] = useState<string | undefined>(undefined);
    const [passwordError, setPasswordError] = useState<string | undefined>(undefined);
    const [idError, setIdError] = useState<string | undefined>(undefined);
    const [emailError, setEmailError] = useState<string | undefined>(undefined);
    const [checkPasswordError, setCheckPasswordError] = useState<string | undefined>(undefined);


    useMemo(() => { if (isLoading) setErrorMessage(undefined) }, [isLoading]);

    const basePath = useClientBasePath();
    const localeHook = useClientLocale();


    const validateCheck = async (categories: RestUserDataValidateCheckCategory[]) => {

        let isError = false;


        const apiUrl = urlJoin(
            basePath.getBasePath()
            , '/api/user/add/validate',
            `?category=${categories.join(',')}`
        );

        const applyData : SignUpData = {};



        const res = await window.fetch(apiUrl, {
            method: 'POST',
            body: JSON.stringify({
                id: categories.find(x => x === 'id') && userIdRef.current?.value,
                password: categories.find(x => x === 'password') && userPasswordRef.current?.value,
                email: categories.find(x => x === 'email') && userEmailRef.current?.value,
                name: categories.find(x => x === 'name') && userNameRef.current?.value
            }),
            headers: {
                'Content-Type': 'application/json',
                'Accept-Language': localeHook.getLocale() ?? localeHook.getDefaultLocale()
            }
        })

        try {
            const resData = await res.json();

            if (categories.find(x => x === 'id')) {
                if (!StringUtil.isEmpty(resData?.data?.id)) {
                    isError = true;
                    setIdError(resData.data.id);
                }
                else {
                    applyData.id = userIdRef.current?.value;
                }

            }

            if (categories.find(x => x === 'email')) {
                if (!StringUtil.isEmpty(resData?.data?.email)) {
                    isError = true;
                    setEmailError(resData.data.email);
                }
                else {
                    applyData.email = userEmailRef.current?.value;
                }

            }

            if (categories.find(x => x === 'name')) {
                if (!StringUtil.isEmpty(resData?.data?.name)) {
                    isError = true;
                    setNameError(resData.data.name);
                }
                else {
                    applyData.name = userNameRef.current?.value;
                }

            }

            if (categories.find(x => x === 'password')) {
                if (!StringUtil.isEmpty(resData?.data?.password)) {
                    isError = true;
                    setPasswordError(resData.data.password);
                }
                else {
                    applyData.password = userPasswordRef.current?.value;
                }

            }

            if (
                categories.find(x => x === 'check-password')
                && userPasswordRef.current?.value.trim() !== checkPasswordRef.current?.value.trim()
            ) {
                isError = true;
                setCheckPasswordError(localeHook.translate('page.signup.message.error.password-not-match'))
            }

            if(applyData){
                signUpHook.setData(applyData);
            }


            return isError;
        }
        catch (e) {
            const message = localeHook.translate('common.system.UNKNOWN_ERROR');

            if (categories.find(x => x === 'id')) {
                setIdError(message);
            }
            if (categories.find(x => x === 'password')) {
                setPasswordError(message);
            }
            if (categories.find(x => x === 'email')) {
                setEmailError(message);
            }
            if (categories.find(x => x === 'name')) {
                setNameError(message);
            }




            return false;
        }


    }

    const applyUser = async () => {
        setLoadState(true);



        const res = await AddUserAction(
            signUpHook.data.id,
            signUpHook.data.password,
            signUpHook.data.name,
            signUpHook.data.email
        );

        if (res.success) {
            alert(res.message);
            route.replace('/signin')
        }
        else {
            setErrorMessage(res.message);
        }

        setLoadState(false);
    }

    useEffect(() => {
        setWinObj(window);
    }, [])

    return (
        <SignCommonForm
            className="cp-signup-form"
        >
           
            <SignUpStepper
                submit={() => applyUser()}
                onChangeStep={() => {
                    setIdError(undefined);
                    setPasswordError(undefined)
                    setEmailError(undefined)
                    setCheckPasswordError(undefined)
                    setNameError(undefined);
                }}
            >
                <SignUpStepper.Item
                    stepCount={1}
                    key={1}
                    validate={() => {

                        let isError = false;

                        if (StringUtil.isEmpty(userNameRef.current?.value)) {
                            isError = true;
                            setNameError(localeHook.translate('page.signup.message.error.name-empty'))
                        }
                        else {
                            signUpHook.setData({
                                name : userNameRef.current?.value
                            });
                        }

                        return isError;
                    }}
                >
                    <SignCommonForm.Input
                        labelText="Name"
                        inputRef={userNameRef}
                        errorMessage={nameError}
                        inputId="user-name"
                    />
                </SignUpStepper.Item>
                <SignUpStepper.Item
                    stepCount={2}
                    key={2}
                    validate={async () => {

                        const result = await validateCheck(
                            ['id', "email"]
                        );

                        return result;

                    }}
                >

                    <SignCommonForm.Input
                        labelText="ID"
                        inputRef={userIdRef}
                        errorMessage={idError}
                        inputId="user-id"
                    />
                    <SignCommonForm.Input
                        labelText="Email"
                        inputRef={userEmailRef}
                        errorMessage={emailError}
                        inputId="user-email"
                    />
                </SignUpStepper.Item>





                <SignUpStepper.Item
                    stepCount={3}
                    key={3}
                    validate={async () => {
                        const result = await validateCheck(
                            ['password', "check-password"]
                        );

                        return result;
                    }}
                >
                    <SignCommonForm.Input
                        labelText="Password"
                        inputRef={userPasswordRef}
                        inputType="password"
                        inputId="user-password"
                        errorMessage={passwordError}
                        onChange={(evt) => {
                            signUpHook.setData({
                                password : evt.currentTarget.value
                            })
                        }}
                    />
                    <SignCommonForm.Input
                        labelText="Check Password"
                        inputRef={checkPasswordRef}
                        inputType="password"
                        inputId="check-password"
                        errorMessage={checkPasswordError}
                    />
                </SignUpStepper.Item>
            </SignUpStepper>

            {
                (errorMessage && winObj) &&
                createPortal(
                    <div className="cp-message-float-box">
                        {errorMessage}
                    </div>,
                    winObj.document.body
                )

            }



            {/* <SignCommonForm.Input
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
            </SignCommonForm.Submit> */}

            {/* <SignCommonForm.ErrorBox
                message={errorMessage}
            /> */}

        </SignCommonForm>
    )
}