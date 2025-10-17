'use client'

import { ChangeEventHandler, HTMLInputAutoCompleteAttribute, HTMLInputTypeAttribute, PropsWithChildren, Ref, RefObject, useImperativeHandle, useRef } from "react"
import { StringUtil } from "../../../libs/util/StringUtil"

interface InputGroupProp {
    className?: string,
    inputType?: HTMLInputTypeAttribute,
    inputDefaultValue?: string,
    inputId?: string,
    onInputChange?: ChangeEventHandler<HTMLInputElement>,
    inputRef?: RefObject<HTMLInputElement | null>,
    ref?: RefObject<HTMLInputElement | null>,
    eventRef?: RefObject<InputGroupEventRef | null>,
    disableInput?: boolean,
    readonlyInput?: boolean,
    inputAutoComplete?: HTMLInputAutoCompleteAttribute
}

export interface InputGroupEventRef {
    reset: () => void,
    getValue : () => string | undefined
}



export const InputGroup = (prop: PropsWithChildren<InputGroupProp>) => {

    const inputId = prop.inputId ?? `cp-input-${StringUtil.randomString(8)}`
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(prop.eventRef, () => ({
        reset: () => {
            const ref = prop.inputRef ?? inputRef;

            if (ref.current) {
                ref.current.value = prop.inputDefaultValue ?? '';
            }
        },
        getValue: () => {
            const ref = prop.inputRef ?? inputRef;
            return ref.current?.value
        }
    }))




    return (
        <div
            className={
                StringUtil.joinClassName(
                    "cp-control",
                    "cp-input-group",
                    prop.className
                )
            }
            ref={prop.ref}
        >
            <label htmlFor={inputId}>{prop.children}</label>
            <input
                type={prop.inputType ?? 'text'}
                defaultValue={prop.inputDefaultValue}
                id={inputId}
                onChange={prop.onInputChange}
                ref={prop.inputRef ?? inputRef}
                readOnly={prop.readonlyInput}
                disabled={prop.disableInput}
                autoComplete={prop.inputAutoComplete ?? 'off'}
            />
        </div>
    )
}