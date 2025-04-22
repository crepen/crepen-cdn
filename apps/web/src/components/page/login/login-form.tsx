'use client'

import {useActionState} from 'react'
import { LoginAction } from '../../../lib/action'
import {useEffect} from 'react'
import { redirect } from 'next/navigation'

export const LoginForm = () => {

    const [state, formAction, isPending] = useActionState(LoginAction.loginUser , {
        state : undefined,
        message : undefined
    })

    useEffect(() => {
        if(isPending === false && state.state !== undefined){
            
            if(state.state === true){
                redirect('/');
            }
            else{
                alert(state.message)    
            }
        }
    },[state , isPending])

    return (
        <form action={formAction}>
            <div>STATE : {state.state}</div>
            <div>MESSAGE : {state.message}</div>
            <div>LOADING : {isPending}</div>
            <input type='text' name='uid'></input>
            <button type='submit'>SUBMIT</button>
        </form>
    )
}