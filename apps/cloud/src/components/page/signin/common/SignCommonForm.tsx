

import { StringUtil } from "@web/lib/util/StringUtil"
import { ChangeEvent, HTMLInputTypeAttribute, MouseEvent, PropsWithChildren, ReactNode, RefObject, useEffect, useMemo, useRef, useState } from "react"

interface SignCommonFormProp {
    className?: string,
    disableSubmit? : boolean
}

export const SignCommonForm = (prop: PropsWithChildren<SignCommonFormProp>) => {
    return (
        <form
             className={StringUtil.joinClassName("cp-sign-common-form", prop.className)}
             onSubmit={(evt) => {
                if(prop.disableSubmit){
                    evt.preventDefault()
                }
             }}
        >
            {prop.children}
        </form>
    )
}


interface SignInputBoxProp {
    className?: string,
    labelText?: string,
    inputRef?: RefObject<HTMLInputElement | null>,
    inputType?: HTMLInputTypeAttribute,
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void,
    inputId?: string
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
                id={prop.inputId}
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

const SignErrorMessage = (prop: SignErrorMessageProp) => {
    return (
        <div className={StringUtil.joinClassName("cp-sign-common-error", prop.className)}>
            <span>{prop.message}</span>
        </div>
    )
}


export interface SignToggleButtonItem {
    icon?: ReactNode,
    title?: string,
    key: string
}

interface SignToggleButtonProp {
    item?: SignToggleButtonItem[],
    className?: string,
    activeToggle?: SignToggleButtonItem,
    onChangeToggle?: (item: SignToggleButtonItem) => void
}

const SignToggleButton = (prop: SignToggleButtonProp) => {

    const [selectItem, setSelectItem] = useState<SignToggleButtonItem | undefined>(prop.activeToggle);

    const toggleItemRef = useRef<HTMLDivElement>(null);

    useMemo(() => {
        if (!prop.activeToggle) {
            if ((prop.item ?? []).length > 0) setSelectItem(prop.item![0]);
        }
        else {
            setSelectItem(prop.activeToggle);
        }
    }, [prop.item])


    useEffect(() => {
        if (prop.onChangeToggle && selectItem) prop.onChangeToggle(selectItem);
    },[selectItem])


    return (
        <div
            className={
                StringUtil.joinClassName(
                    'cp-sign-common-toggle-button',
                    prop.className
                )
            }
            ref={toggleItemRef}
        >
            {
                (prop.item ?? []).map((item, idx) => (
                    <div
                        key={idx}
                        className={
                            StringUtil.joinClassName(
                                "cp-sign-common-toggle-item-button",
                                selectItem === item ? 'active' : ''
                            )
                        }
                        onClick={() => {
                            setSelectItem(item);
                        }}
                    >
                        {
                            item.icon &&
                            <div className="cp-button-icon">
                                {item.icon}
                            </div>
                        }
                        {
                            item.title &&
                            <div className="cp-button-title">
                                {item.title}
                            </div>
                        }
                    </div>
                ))
            }
        </div>
    )
}



SignCommonForm.Input = SignInputBox;
SignCommonForm.Submit = SignSubmitButton;
SignCommonForm.ErrorBox = SignErrorMessage;
SignCommonForm.ToggleButton = SignToggleButton;