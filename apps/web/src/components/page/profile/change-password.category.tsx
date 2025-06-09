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
    current : boolean
}

export const ProfileChangePasswordCategory = () => {

    const currentPasswordInputRef = useRef<HTMLInputElement>(null);
    const newPasswordInputRef = useRef<HTMLInputElement>(null);
    const confirmPasswordInputRef = useRef<HTMLInputElement>(null);

    const initValidState: PasswordValidateState = { maxLength: false, combine: false, match: false, minLength: false , current : false};

    const [validateState, setValidateState] = useState<PasswordValidateState>(initValidState);

    const [state, formAction, isPending] = useActionState(UserAction.changePasswordAction, {
        success: undefined,
        message: undefined
    })

    const changeHandler = () => {
        const currentPassword = currentPasswordInputRef.current?.value;
        const newPassword = newPasswordInputRef.current?.value;
        const confirmPassword = confirmPasswordInputRef.current?.value;

        let changeState: PasswordValidateState = {
            ...validateState
        }

        if(StringUtil.isEmpty(currentPassword)){
            changeState = {
                ...changeState,
                current : false
            }
        }
        else{
            changeState = {
                ...changeState,
                current : true
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

            if (state.success === true) {
                // const callbackUrl = searchParams.get('callback')?.toString();
                // // location.href = StringUtil.shiftEmptyString(callbackUrl, '/');
                // redirect(StringUtil.shiftEmptyString(callbackUrl, '/cloud'));
                setValidateState(initValidState)
                alert(state.message);
            }
            else {
                alert(state.message)
            }
        }
    }, [state, isPending])

    return (
        <ProfileCategoryGroup className='cp-change-password'>
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
                        <li data-validate={validateState.current ? 'true' : 'false'}>Current password not empty</li>
                        <li data-validate={validateState.maxLength ? 'true' : 'false'}>Max Length : 16</li>
                        <li data-validate={validateState.minLength ? 'true' : 'false'}>Min Length : 12</li>
                        <li data-validate={validateState.combine ? 'true' : 'false'}>Combine Number / English</li>
                        <li data-validate={validateState.match ? 'true' : 'false'}>Match new password and confirm password</li>
                    </ul>
                </div>
                <div className="cp-form-submit">
                    <input type='submit' value='Change Password' disabled={Object.values(validateState).filter(x => x === false).length !== 0} />
                </div>

            </form>
        </ProfileCategoryGroup>
    )
}