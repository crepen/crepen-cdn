'use server'

import Link from "next/link";

import '@web/assets/styles/page/signin/signin.page.scss'
import { SignInForm } from "@web/component/page/signin/SignInForm";


const SignInPage = async () => {
    return (
        <div className="cp-page cp-signin-page" data-loading-state={false}>
            <div className="cp-page-box">
                <SignInForm />
            </div>


        </div>
    )
}

export default SignInPage;