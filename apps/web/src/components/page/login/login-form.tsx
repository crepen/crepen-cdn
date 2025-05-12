'use client'

import { useActionState } from 'react'
import { LoginAction } from '../../../lib/action'
import { useEffect } from 'react'
import { redirect, useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import { StringUtil } from '../../../lib/util/string.util'
import LabelInput from '@web/components/controls/label-input/label-input'
import LoadingButton from '@web/components/controls/loading-button/loading-button'

export const LoginForm = () => {

    const [state, formAction, isPending] = useActionState(LoginAction.loginUser, {
        state: undefined,
        message: undefined
    })

    const searchParams = useSearchParams();

    useEffect(() => {

        if (isPending === false && state.state !== undefined) {

            if (state.state === true) {
                const callbackUrl = searchParams.get('callback')?.toString();
                redirect(StringUtil.shiftEmptyString(callbackUrl, '/'));
            }
            else {
                alert(state.message)
            }
        }
    }, [state, isPending])

    return (
        <form action={formAction} className='login-form'>
            <LabelInput
                inputType='text'
                label='ID or Email'
                formName='username'
                showResetButton
            />

            <LabelInput
                inputType='password'
                label='Password'
                formName='password'
                showResetButton
                showPasswordVisibleButton
            />

            <LoadingButton 
                type='submit'
                isLoading={isPending}
                label='SUBMIT'
            />

        </form>
    )
}