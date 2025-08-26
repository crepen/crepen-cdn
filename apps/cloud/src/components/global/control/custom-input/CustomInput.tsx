'use client'


import './custom-input.control.scss';
import { StringUtil } from "@web/lib/util/StringUtil"
import { ChangeEvent, FocusEvent, HTMLInputTypeAttribute, RefObject, useImperativeHandle, useRef } from "react"

interface CustomInputProp {
    className?: string,
    inputType?: HTMLInputTypeAttribute,
    inputId?: string,
    inputErrorMessage?: string,
    label?: string,
    inputRef?: RefObject<HTMLInputElement | null>,
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void,
    defaultValue?: string,
    inputReadOnly?: boolean,
    onBlur?: (evt: FocusEvent<HTMLInputElement>) => void,
    errorRef?: RefObject<CustomInputErrorMessageRef | null>
}

export interface CustomInputErrorMessageRef {
    setError: (error?: string) => void,
    resetError: () => void
}

export const CustomInput = (prop: CustomInputProp) => {

    const errorSpanRef = useRef<HTMLSpanElement>(null);
    const errorDivRef = useRef<HTMLDivElement>(null);


    useImperativeHandle(prop.errorRef, () => ({
        setError: (error?: string) => {
            if (!StringUtil.isEmpty(error)) {
                errorDivRef.current?.classList.add('cp-active')

                if (errorSpanRef.current) {
                    errorSpanRef.current.innerHTML = error ?? '';
                }

            }
            else {
                errorDivRef.current?.classList.remove('cp-active')
                if (errorSpanRef.current) {
                    errorSpanRef.current.innerHTML = '';
                }
            }
        },
        resetError: () => {
            errorDivRef.current?.classList.remove('cp-active')
            if (errorSpanRef.current) {
                errorSpanRef.current.innerHTML = '';
            }
        }
    }))

    return (
        <div
            className={StringUtil.joinClassName("cp-custom-input", prop.className)}

        >
            <div className="cp-input-wrapper" data-label={prop.label}>
                <input
                    placeholder=""
                    type={prop.inputType ?? 'text'}
                    id={prop.inputId}
                    ref={prop.inputRef}

                    onChange={prop.onChange}
                    defaultValue={prop.defaultValue}
                    readOnly={prop.inputReadOnly}
                    onBlur={prop.onBlur}
                />
            </div>
            {
                (prop.inputErrorMessage || prop.errorRef) &&
                <div className="cp-input-error" ref={errorDivRef}>
                    <span ref={errorSpanRef}>{prop.inputErrorMessage}</span>
                </div>
            }

        </div>
    )
}