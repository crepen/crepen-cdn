'use server'

import '@web/assets/styles/page/signin/signup.page.scss'
import { CommonPage } from "@web/component/global/CommonPage"
import { TextHr } from '@web/component/global/control/text-hr/TextHr';
import { SignInLogo } from "@web/component/page/signin/SignInLogo";
import { SignUpForm } from '@web/component/page/signin/signup/SignUpForm';
import Link from 'next/link';

const SignUpPage = () => {
    return (
        <CommonPage className="cp-signup-page">
            <CommonPage.Header>
                <SignInLogo />
                <div className='cp-page-title'>
                    Sign Up
                </div>
            </CommonPage.Header>
            <CommonPage.Content>
                <SignUpForm />
            </CommonPage.Content>
            <CommonPage.Footer>
                <TextHr 
                    text='OR'
                />
                <Link href={'/signin'} className='cp-move-signin-button'>
                    Return Sign In
                </Link>
            </CommonPage.Footer>
        </CommonPage>
    )
}

export default SignUpPage;