'use client'

import { useEffect, useRef } from "react"
import { useSignIn } from "./useSignIn";
import { useRouter, useSearchParams } from "next/navigation";
import { useClientLocale } from "@web/lib/module/locale/ClientLocaleProvider";
import { useClientBasePath } from "@web/lib/module/basepath/ClientBasePathProvider";
import { StringUtil } from "@web/lib/util/StringUtil";
import { SignCommonForm } from "./common/SignCommonForm";

export const SignInForm = () => {

    const signInHook = useSignIn();
    const router = useRouter();
    const localeHook = useClientLocale();
    const searchParamHook = useSearchParams();

    const inputIdRef = useRef<HTMLInputElement>(null);
    const inputPasswordRef = useRef<HTMLInputElement>(null);


    useEffect(() => {
        if (signInHook.state === true) {
            const callbackUrl = searchParamHook.get('callback') ?? '/';

            router.replace(callbackUrl)
        }
    }, [signInHook.state])

    return (
        <SignCommonForm>
            <SignCommonForm.Input
                labelText={localeHook.translate('page.signin.input.id')}
                inputRef={inputIdRef}
                inputId="id"

            />
            <SignCommonForm.Input
                labelText={localeHook.translate('page.signin.input.password')}
                inputRef={inputPasswordRef}
                inputType="password"
                inputId="password"
            />

            <SignCommonForm.Submit
                activeLoading={signInHook.loading}
                onClick={() => signInHook.active(inputIdRef.current?.value, inputPasswordRef.current?.value)}
            >
                Sign in
            </SignCommonForm.Submit>
            <SignCommonForm.ErrorBox
                message={!signInHook.state ? signInHook.message : ''}
            />
        </SignCommonForm>
    )

    return (
        <div className='cp-form'>
            <div className='cp-input-item' data-label={localeHook.translate('page.signin.input.id')} >
                <input type='text' name='id' placeholder='' ref={inputIdRef}></input>
            </div>
            <div className='cp-input-item' data-label={localeHook.translate('page.signin.input.password')}>
                <input type='password' name='password' placeholder='' ref={inputPasswordRef}></input>
            </div>

            <div className="cp-form-error-message">
                <span>{!signInHook.state && signInHook.message}</span>
            </div>

            <div className='cp-submit'>
                <div
                    className={StringUtil.joinClassName('cp-button', signInHook.loading ? 'cp-loading' : '')}
                    onClick={() => signInHook.active(inputIdRef.current?.value, inputPasswordRef.current?.value)}
                >
                    {
                        signInHook.loading
                            ? <div className="cp-loading" />
                            : <span>{localeHook.translate('page.signin.button.submit')}</span>
                    }
                </div>
            </div>
        </div>
    )
}