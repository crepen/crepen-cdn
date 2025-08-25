'use client'


import './custom-input.control.scss';
import { StringUtil } from "@web/lib/util/StringUtil"
import { ChangeEvent, HTMLInputTypeAttribute, RefObject } from "react"

interface CustomInputProp {
    className?: string,
    inputType?: HTMLInputTypeAttribute,
    inputId?: string,
    inputErrorMessage?: string,
    label?: string,
    inputRef?: RefObject<HTMLInputElement | null>,
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void,
    defaultValue? : string,
    inputReadOnly?: boolean
}

export const CustomInput = (prop: CustomInputProp) => {
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
                />
            </div>
            {
                prop.inputErrorMessage &&
                <div className="cp-input-error">
                    <span>{prop.inputErrorMessage}</span>
                </div>
            }

        </div>
    )
}