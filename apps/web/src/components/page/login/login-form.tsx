'use client'

import { useActionState , useRef} from 'react'
import { LoginAction } from '../../../lib/action'
import { useEffect } from 'react'
import { redirect, useRouter, useSearchParams } from 'next/navigation'
import { StringUtil } from '../../../lib/util/string.util'
import LabelInput from '@web/components/controls/label-input/label-input'
import LoadingButton from '@web/components/controls/loading-button/loading-button'
import { useFormState } from 'react-dom'

export const LoginForm = () => {

    const [state, formAction, isPending] = useActionState(LoginAction.loginUser, {
        state: undefined,
        message: undefined
    })

    const idInputRef = useRef<HTMLInputElement>(null);

    // const [state, formAction, isPending] = useFormState(LoginAction.loginUser, {
    //     state: undefined,
    //     message: undefined
    // })

    const searchParams = useSearchParams();

    useEffect(() => {
        if (isPending === false && state?.state !== undefined) {

            if (state.state === true) {
                const callbackUrl = searchParams.get('callback')?.toString();
                // location.href = StringUtil.shiftEmptyString(callbackUrl, '/');
                redirect(StringUtil.shiftEmptyString(callbackUrl, '/cloud'));
            }
            else {
                alert(state.message)
            }
        }
    }, [state, isPending])

    useEffect(() => {
        idInputRef.current?.focus();
    },[])

    return (
        <form action={formAction} className='login-form'>
            <LabelInput
                inputType='text'
                label='ID or Email'
                formName='id'
                showResetButton
                inputRef={idInputRef}
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