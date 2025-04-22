import { Metadata } from 'next';
import {Fragment} from 'react'
import { LoginAction } from '../../../lib/action';
import { LoginForm } from '../../../components/page/login/login-form';


export const metadata: Metadata = {
    title: "CrepenCDN - Login",
};

const LoginPage = () => {

    return (
        <Fragment>
            <LoginForm />
        </Fragment>
    )
}

export default LoginPage;