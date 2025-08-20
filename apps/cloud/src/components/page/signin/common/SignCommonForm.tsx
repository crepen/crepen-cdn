import { StringUtil } from "@web/lib/util/StringUtil"
import { ChangeEvent, HTMLInputTypeAttribute, MouseEvent, PropsWithChildren, RefObject } from "react"

interface SignCommonFormProp {
    className?: string
}

export const SignCommonForm = (prop: PropsWithChildren<SignCommonFormProp>) => {
    return (
        <form className={StringUtil.joinClassName("cp-sign-common-form", prop.className)}>
            {prop.children}
        </form>
    )
}


interface SignInputBoxProp {
    className?: string,
    labelText?: string,
    inputRef?: RefObject<HTMLInputElement | null>,
    inputType?: HTMLInputTypeAttribute,
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void
}

const SignInputBox = (prop: SignInputBoxProp) => {
    return (
        <div
            className={StringUtil.joinClassName("cp-sign-common-input", prop.className)}
            data-label={prop.labelText}
        >
            <input
                placeholder=""
                type={prop.inputType ?? 'text'}
                ref={prop.inputRef}
                onChange={prop.onChange}
            />
        </div>
    )
}


interface SignSubmitButtonProp {
    className?: string,
    activeLoading?: boolean,
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void,
    buttonType?: "button" | "reset" | "submit"
}

const SignSubmitButton = (prop: PropsWithChildren<SignSubmitButtonProp>) => {
    return (
        <button
            className={
                StringUtil.joinClassName(
                    "cp-sign-common-submit",
                    prop.className,
                    prop.activeLoading ? 'cp-loading' : ''
                )
            }
            onClick={prop.onClick}
            type={prop.buttonType ?? 'button'}
        >
            <div className="cp-context">
                {prop.children}
            </div>
            <div className="cp-loader" />
        </button>
    )
}

interface SignErrorMessageProp {
    message?: string,
    className?: string
}

const SignErrorMessage = (prop : SignErrorMessageProp) => {
    return (
        <div className={StringUtil.joinClassName("cp-sign-common-error" , prop.className)}>
            <span>{prop.message}</span>
        </div>
    )
}


SignCommonForm.Input = SignInputBox;
SignCommonForm.Submit = SignSubmitButton;
SignCommonForm.ErrorBox = SignErrorMessage;