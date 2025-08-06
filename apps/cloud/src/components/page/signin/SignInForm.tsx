'use client'

import { StringUtil } from "@web/lib/util/StringUtil";
import Link from "next/link"
import { Fragment, useEffect, useRef, useState } from "react"
import { useSignIn } from "./useSignIn";
import { useRouter } from "next/navigation";

export const SignInForm = () => {

    const signInHook = useSignIn();
    const router = useRouter();

    const inputIdRef = useRef<HTMLInputElement>(null);
    const inputPasswordRef = useRef<HTMLInputElement>(null);


    useEffect(() => {
        if(signInHook.state === true){
            router.push('/');
        }
    }, [signInHook.state])


    return (
        <Fragment>
            <div className="cp-login-box">
                <div className='cp-section cp-header'>
                    SIGN IN
                </div>
                <div className='cp-section cp-content'>
                    <div className='cp-form'>
                        <div className='cp-input-item' data-label="ID or Email" >
                            <input type='text' name='id' placeholder='' ref={inputIdRef}></input>
                        </div>
                        <div className='cp-input-item' data-label="Password">
                            <input type='password' name='password' placeholder='' ref={inputPasswordRef}></input>
                        </div>

                        <div className="cp-form-error-message">
                            <span>{!signInHook.state && signInHook.message}</span>
                        </div>
                    </div>

                    <div className='cp-submit'>
                        <div className='cp-button' onClick={() => signInHook.active(inputIdRef.current?.value , inputPasswordRef.current?.value)}>
                            <span>SIGN IN</span>
                        </div>
                    </div>
                </div>
                <div className='cp-section cp-footer'>
                    {/* <Link href={'/signin/password'}>Find Password</Link> */}
                </div>
            </div>

            <div className={StringUtil.joinClassName("cp-loading-box", signInHook.loading ? 'active' : undefined)}>
                <div className="cp-loading-spinner">
                    <div className="cp-loading-dot" />
                    <div className="cp-loading-dot" />
                    <div className="cp-loading-dot" />
                    <div className="cp-loading-dot" />
                </div>
            </div>
        </Fragment>
    )
}