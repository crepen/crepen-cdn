'use client'

import { useActionState } from 'react'
import { LoginAction } from '../../../lib/action'
import { useEffect } from 'react'
import { redirect } from 'next/navigation'

export const LoginForm = () => {

    const [state, formAction, isPending] = useActionState(LoginAction.loginUser, {
        state: undefined,
        message: undefined
    })

    useEffect(() => {

        console.log("EE")
        if (isPending === false && state.state !== undefined) {

            if (state.state === true) {
                redirect('/');
            }
            else {
                alert(state.message)
            }
        }
    }, [state, isPending])

    return (
        <form action={formAction} className='login-form'>
            <div className='dev'>STATE : {state.state}</div>
            <div className='dev'>MESSAGE : {state.message}</div>
            <div className='dev'>LOADING : {isPending}</div>
            <div className='form-input-box'>
                <span className='input-label'>ID</span>
                <input className='input-content' type='text' name='uid' placeholder=''></input>
            </div>
            <div className='form-input-box'>
                <span className='input-label'>Password</span>
                <input className='input-content' type='password' name='password' placeholder=''></input>
            </div>
            <button type='submit' className='form-submit'>SUBMIT</button>
        </form>
    )
}