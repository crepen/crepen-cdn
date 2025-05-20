import LogoImage from '@web/assets/img/crepen-cdn-logo.png';

import { Metadata } from 'next';
import { LoginForm } from '@web/components/page/login/login-form';
import Image from 'next/image';
import BaseButton from '@web/components/controls/base-button/base-button';





export const metadata: Metadata = {
    title: "CrepenCDN - Login",
};

const CloudLoginPageRouter = () => {

    return (
        <div className='cp-page'>
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

export default CloudLoginPageRouter;