'use client'

import './label-input.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faEye, faLock, faStop } from '@fortawesome/free-solid-svg-icons';
import { Ref, RefObject, useRef, useState } from 'react'

interface LabelInputProp {
    label: string,
    inputType: 'text' | 'password',
    formName?: string,
    inputRef?: RefObject<HTMLInputElement | null>,
    showResetButton?: boolean,
    showPasswordVisibleButton? : boolean,
    inputId? : string
    defaultValue? : string
}

/** @deprecated */
const LabelInput = (prop: LabelInputProp) => {

    const [isShowPassword, setShowPassword] = useState<boolean>(false);
    const inputRef: RefObject<HTMLInputElement | null> = prop.inputRef ?? useRef<HTMLInputElement>(null);

    return (
        <div className="crepen-label-input">
            <span className="inner-label">{prop.label}</span>
            <input className="inner-input"
                id={prop.inputId}
                type={isShowPassword === true ? 'text' : prop.inputType}
                name={prop.formName}
                defaultValue={prop.defaultValue ?? ''}
                ref={inputRef}
            ></input>
            <div className='inner-actions'>
                {
                    (prop.inputType === 'password' && prop.showPasswordVisibleButton === true)
                    && <FontAwesomeIcon
                        icon={faLock}
                        className='action-item action-show-password-bt'
                        onMouseDown={() => setShowPassword(true)}
                        onMouseUp={() => setShowPassword(false)}
                    />
                }

                {
                    prop.showResetButton === true
                    && <FontAwesomeIcon
                        icon={faCircleXmark}
                        className='action-item action-clear-bt'
                        onClick={() => {
                            if (!!inputRef.current?.value) {
                                inputRef.current.value = '';
                            }
                        }}

                    />
                }

            </div>

        </div>
    )
}


export default LabelInput;