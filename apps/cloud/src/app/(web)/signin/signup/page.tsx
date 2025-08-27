'use server'

import '@web/assets/styles/page/signin/signup.page.scss'
import { CommonPage } from "@web/component/global/CommonPage"
import { TextHr } from '@web/component/global/control/text-hr/TextHr';
import { SignInLogo } from "@web/component/page/signin/SignInLogo";
import { SignUpDataProvider } from '@web/component/page/signin/signup/SignUpDataProvider';
import { SignUpForm } from '@web/component/page/signin/signup/SignUpForm';
import { LocaleConfig } from '@web/lib/config/LocaleConfig';
import { ServerLocaleProvider } from '@web/lib/module/locale/ServerLocaleProvider';
import { Metadata } from 'next';
import Link from 'next/link';

export const generateMetadata = async (): Promise<Metadata> => {
    const localeProv = ServerLocaleProvider.current(LocaleConfig);

    return {
        title: await localeProv.translate('title.signup')
    }
}


const SignUpPage = () => {
    return (
        <SignUpDataProvider>
            <CommonPage className="cp-signup-page">
                <CommonPage.Wrapper
                    noPadding
                    size='full'
                    template
                >
                    <CommonPage.Header>
                        <SignInLogo />
                        {/* <div className='cp-page-title'>
                    Sign Up
                </div> */}
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
                </CommonPage.Wrapper>
            </CommonPage>
        </SignUpDataProvider>
    )
}

export default SignUpPage;