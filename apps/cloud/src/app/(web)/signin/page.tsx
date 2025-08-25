'use server'


import '@web/assets/styles/page/signin/signin.page.scss'
import { SignInForm } from "@web/component/page/signin/SignInForm";
import { ServerLocaleProvider } from "@web/lib/module/locale/ServerLocaleProvider";
import { LocaleConfig } from "@web/lib/config/LocaleConfig";
import { BasePathInitializer } from "@web/lib/module/basepath/BasePathInitializer";
import { headers } from "next/headers";
import { SignInLogo } from "@web/component/page/signin/SignInLogo";
import { TextHr } from "@web/component/global/control/text-hr/TextHr";
import { SignInFindIdButton } from '@web/component/page/signin/SignInFindIdButton';
import { SignInResetPasswordButton } from '@web/component/page/signin/SignInResetPasswordButton';
import { SignInSignUpButton } from '@web/component/page/signin/SignInSignUpButton';
import { CommonPage } from '@web/component/global/CommonPage';
import { Metadata } from 'next';




export const generateMetadata = async (): Promise<Metadata> => {
    const localeProv = ServerLocaleProvider.current(LocaleConfig);

    return {
        title: await localeProv.translate('title.signin')
    }
}


const SignInPage = async () => {

    const localeProv = ServerLocaleProvider.current(LocaleConfig);
    const basePath = BasePathInitializer.get({ readHeader: await headers() })

    return (
        <CommonPage className='cp-signin-page'>
            <CommonPage.Header>
                <div className="cp-logo">
                    <SignInLogo />
                </div>
                <div className="cp-title">
                    {localeProv.translate('page.signin.title')}
                </div>
                <div className="cp-sub-title">
                    {localeProv.translate('page.signin.subtitle')}
                </div>
            </CommonPage.Header>
            <CommonPage.Content>
                <SignInForm />
            </CommonPage.Content>
            <CommonPage.Footer>
                <TextHr text="OR" />

                <SignInSignUpButton />

                <div className="cp-footer-action">
                    <SignInFindIdButton />
                    <SignInResetPasswordButton />
                </div>
            </CommonPage.Footer>

        </CommonPage>
    )


}

export default SignInPage;