'use client'

import { StringUtil } from "@web/lib/util/StringUtil";
import { Fragment, useEffect, useRef } from "react"
import { useSignIn } from "./useSignIn";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useClientLocale } from "@web/lib/module/locale/ClientLocaleProvider";
import { useClientBasePath } from "@web/lib/module/basepath/ClientBasePathProvider";
import { TextHr } from "@web/component/global/control/text-hr/TextHr";
import { SignInActionButton } from "./SignInActionButton";
import { faLanguage } from "@fortawesome/free-solid-svg-icons/faLanguage";

export const SignInForm = () => {

    const signInHook = useSignIn();
    const router = useRouter();
    const localeHook = useClientLocale();
    const basePathHook = useClientBasePath();
    const searchParamHook = useSearchParams();

    const inputIdRef = useRef<HTMLInputElement>(null);
    const inputPasswordRef = useRef<HTMLInputElement>(null);


    useEffect(() => {
        if (signInHook.state === true) {
            const callbackUrl = searchParamHook.get('callback') ?? '/';
            
            router.replace(callbackUrl )
        }
    }, [signInHook.state])


    return (
        <Fragment>
            <div className="cp-login-box">
                <div className='cp-section cp-header'>
                    <div className="cp-logo">
                        <Image
                            src={basePathHook.getBasePath() + '/resource/image/logo.png'}
                            width={197}
                            height={66}
                            alt="Logo Image"
                        />
                    </div>
                    <div className="cp-title">
                        {localeHook.translate('signin.page.title')}
                    </div>
                    <div className="cp-sub-title">
                        {localeHook.translate('signin.page.subtitle')}
                    </div>
                </div>
                <div className='cp-section cp-content'>
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
                    </div>

                    <div className='cp-submit'>
                        <div className='cp-button' onClick={() => signInHook.active(inputIdRef.current?.value, inputPasswordRef.current?.value)}>
                            {
                                signInHook.loading
                                    ? <div className="cp-loading" />
                                    : <span>{localeHook.translate('page.signin.button.submit')}</span>
                            }


                        </div>
                    </div>
                </div>
                <div className='cp-section cp-footer'>
                    {/* <Link href={'/signin/password'}>Find Password</Link> */}
                    <TextHr text="OR" />
                    <div className="cp-footer-action">
                        <SignInActionButton
                            icon={faLanguage}
                        />
                    </div>
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