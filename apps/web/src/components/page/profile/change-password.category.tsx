'use client'

import { useActionState, useEffect, useRef, useState } from "react"
import { ProfileCategoryGroup } from "./category-group"
import * as UserAction from "@web/lib/action/user"
import { StringUtil } from "@web/lib/util/string.util"


interface PasswordValidateState {
    maxLength: boolean,
    minLength: boolean,
    combine: boolean,
    match: boolean,
    current: boolean
}

export const ProfileChangePasswordCategory = () => {

    const currentPasswordInputRef = useRef<HTMLInputElement>(null);
    const newPasswordInputRef = useRef<HTMLInputElement>(null);
    const confirmPasswordInputRef = useRef<HTMLInputElement>(null);

    const initValidState: PasswordValidateState = { maxLength: false, combine: false, match: false, minLength: false, current: false };

    const [validateState, setValidateState] = useState<PasswordValidateState>(initValidState);

    const [state, formAction, isPending] = useActionState(UserAction.changePasswordAction, {
        success: undefined,
        message: undefined,
        lastValue: undefined
    })

    const changeHandler = () => {
        const currentPassword = currentPasswordInputRef.current?.value;
        const newPassword = newPasswordInputRef.current?.value;
        const confirmPassword = confirmPasswordInputRef.current?.value;

        let changeState: PasswordValidateState = {
            ...validateState
        }

        if (StringUtil.isEmpty(currentPassword)) {
            changeState = {
                ...changeState,
                current: false
            }
        }
        else {
            changeState = {
                ...changeState,
                current: true
            }
        }

        if (newPassword?.trim() === confirmPassword?.trim()) {
            changeState = {
                ...changeState,
                match: true
            }
        }
        else {
            changeState = {
                ...changeState,
                match: false
            }
        }

        const combineRegex = new RegExp('(?=.*\\d)(?=.*[a-z]).{1,}');

        if (combineRegex.test(newPassword ?? '')) {
            changeState = {
                ...changeState,
                combine: true
            }
        }
        else {
            changeState = {
                ...changeState,
                combine: false
            }
        }

        if ((newPassword?.length ?? 0) >= 12) {
            changeState = {
                ...changeState,
                minLength: true
            }
        }
        else {
            changeState = {
                ...changeState,
                minLength: false
            }
        }

        if ((newPassword?.length ?? 0) <= 16) {
            changeState = {
                ...changeState,
                maxLength: true
            }
        }
        else {
            changeState = {
                ...changeState,
                maxLength: false
            }
        }

        setValidateState(changeState);
    }

    useEffect(() => {
        if (isPending === false && state?.success !== undefined) {
            setValidateState(initValidState)

            if (state.success !== true) {
                if (currentPasswordInputRef.current) {
                    currentPasswordInputRef.current.value = state.lastValue?.currentPassword ?? '';
                }

                if (newPasswordInputRef.current) {
                    newPasswordInputRef.current.value = state.lastValue?.newPassword ?? '';
                }

                if (confirmPasswordInputRef.current) {
                    confirmPasswordInputRef.current.value = state.lastValue?.confirmPassword ?? '';
                }
            }

            changeHandler();
        }
    }, [state, isPending])

    return (
        <ProfileCategoryGroup
            className='cp-change-password'
            title="Change Password"
        >
            <form autoComplete="off" action={formAction}>
                <div className="cp-form-value">
                    <input
                        type='password'
                        placeholder='Current password'
                        name="current-password"
                        ref={currentPasswordInputRef}
                        onChange={changeHandler}
                    />
                    <input
                        type='password'
                        placeholder='New password'
                        onChange={changeHandler}
                        ref={newPasswordInputRef}
                        name="new-password"
                    />
                    <input
                        type='password'
                        placeholder='Confirm new password'
                        onChange={changeHandler}
                        ref={confirmPasswordInputRef}
                        name="confirm-password"
                    />
                </div>
                <div className="cp-form-validate">
                    <ul>
                        <li data-validate={validateState.maxLength && validateState.minLength ? 'true' : 'false'}>비밀번호는 12~16자여야 합니다.</li>
                        <li data-validate={validateState.combine ? 'true' : 'false'}>영문 및 숫자가 최소 1개 이상 포함되어야 합니다.</li>
                        <li data-validate={validateState.match ? 'true' : 'false'}>비밀번호와 비밀번호 확인란이 동일해야 합니다.</li>
                    </ul>
                </div>
                <div className="cp-form-submit">
                    <span className="cp-form-response-message" data-state={state.success}>
                        {state.message}
                    </span>
                    <button type="submit" disabled={Object.values(validateState).filter(x => x === false).length !== 0} >
                        Change Password
                    </button>
                </div>

            </form>
        </ProfileCategoryGroup>
    )
}