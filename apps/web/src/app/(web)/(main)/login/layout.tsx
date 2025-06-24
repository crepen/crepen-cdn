import '@web/assets/style/cloud/page/login/cloud.login.scss';

import { PropsWithChildren } from 'react'

const LoginLayoutRouter = ({ children }: PropsWithChildren) => {
    return (
        <div className="cp-cloud cp-login">
            {children}
        </div>
    )
}

export default LoginLayoutRouter;