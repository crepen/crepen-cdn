import '@web/assets/style/login/login.scss';
import LogoImage from '@web/assets/img/crepen-cdn-logo.png';

import { Metadata } from 'next';
import { Fragment } from 'react'
import { LoginAction } from '../../../lib/action';
import { LoginForm } from '../../../components/page/login/login-form';
import Image from 'next/image';
import BaseButton from '@web/components/controls/base-button/base-button';





export const metadata: Metadata = {
    title: "CrepenCDN - Login",
};

const LoginPage = () => {

    return (
        <div className='login-page'>
            <div className='login-box'>
                <div className='logo'>
                    <Image
                        src={LogoImage}
                        alt='Logo Image'
                        width={200}
                    />
                </div>
                <LoginForm />

                <div className='page-hr'>

                </div>

                <BaseButton
                    theme='secondary'
                    type='button'
                >
                    Sign Up
                </BaseButton>
            </div>

        </div>
    )
}

export default LoginPage;