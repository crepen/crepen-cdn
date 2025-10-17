'use client'

import { HTMLInputTypeAttribute, RefObject, useRef, useState } from "react"
import { StringUtil } from "../../libs/util/StringUtil";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import { ImSpinner2 } from "react-icons/im";
import { CommonUtil } from "../../libs/util/CommonUtil";
import { SignInAction } from "../../libs/action/AdminAuthAction";
import { useRouter } from "next/navigation";

export const SignInForm = () => {

    const [isLoading, setLoadState] = useState<boolean>(false);

    const idRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const route = useRouter();

    const onSignIn = async () => {
        if (!isLoading) {
            setLoadState(true)

            const res = await SignInAction(idRef.current?.value, passwordRef.current?.value);

            if (res.success) {
                route.refresh();    
            }
            else {
                alert(res.message);
            }

            setLoadState(false)
        }
    }


    return (
        <div className="cp-signin-form">
            <FormInputGroup
                inputId="id"
                inputType="text"
                labelText="ID or Email"
                inputRef={idRef}
            />

            <FormInputGroup
                inputId="password"
                inputType="password"
                labelText="Password"
                inputRef={passwordRef}
            />

            <button
                className={StringUtil.joinClassName("cp-signin-button", isLoading ? 'cp-loading' : '')}
                onClick={onSignIn}
            >
                <span>Login</span>
                <div className="cp-loading-spinner">
                    <ImSpinner2 size={16} />
                </div>
            </button>
        </div>
    )
}


interface FormInputGroupProp {
    inputType?: HTMLInputTypeAttribute,
    inputId: string,
    labelText?: string,
    inputRef?: RefObject<HTMLInputElement | null>
}

const FormInputGroup = (prop: FormInputGroupProp) => {
    return (
        <div className="cp-form-input-group">
            <label htmlFor={prop.inputId}>{prop.labelText}</label>
            <input type={prop.inputType ?? 'text'} id={prop.inputId} ref={prop.inputRef} />
        </div>
    )
}