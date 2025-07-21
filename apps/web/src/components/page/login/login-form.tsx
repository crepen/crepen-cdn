'use client'

import { useActionState, useRef } from 'react'
import { LoginAction } from '../../../lib/action'
import { useEffect } from 'react'
import { redirect, useRouter, useSearchParams } from 'next/navigation'
import { StringUtil } from '../../../lib/util/string.util'
import LabelInput from '@web/components/controls/label-input/label-input'
import LoadingButton from '@web/components/controls/loading-button/loading-button'
import { useFormState } from 'react-dom'

export const LoginForm = () => {

    const [state, formAction, isPending] = useActionState(LoginAction.loginUser, {
        success: undefined,
        message: undefined,
        lastValue: undefined
    })

    const idInputRef = useRef<HTMLInputElement>(null);
    const passwordInputRef = useRef<HTMLInputElement>(null);

    // const [state, formAction, isPending] = useFormState(LoginAction.loginUser, {
    //     state: undefined,
    //     message: undefined
    // })

    const searchParams = useSearchParams();

    useEffect(() => {
        if (isPending === false && state?.success !== undefined) {

            if (state.success === true) {
                const callbackUrl = searchParams.get('callback')?.toString();
                // location.href = StringUtil.shiftEmptyString(callbackUrl, '/');
                // alert(callbackUrl)
                // console.log(searchParams.keys());
                redirect(StringUtil.shiftEmptyString(callbackUrl, '/'));
            }
            else {

                if (idInputRef.current) {
                    idInputRef.current.value = state.lastValue?.userId ?? ''
                }

                if (passwordInputRef.current) {
                    passwordInputRef.current.value = state.lastValue?.password ?? ''
                }

                alert(state.message)
            }
        }
    }, [state, isPending])

    useEffect(() => {
        idInputRef.current?.focus();
    }, [])

    return (
        <form action={formAction} className='login-form'>
            <LabelInput
                inputType='text'
                label='ID or Email'
                formName='id'
                showResetButton
                inputRef={idInputRef}
                defaultValue='demo'
            />

            <LabelInput
                inputType='password'
                label='Password'
                formName='password'
                showResetButton
                showPasswordVisibleButton
                inputRef={passwordInputRef}
                defaultValue='qwer1234qwer1234'
            />

            <LoadingButton
                type='submit'
                isLoading={isPending}
                label='SUBMIT'
            />

        </form>
    )
}