import { Fragment, PropsWithChildren } from 'react'

const LoginLayout = ({ children }: PropsWithChildren) => {
    return (
        <Fragment>
            {children}
        </Fragment>
    )
}

export default LoginLayout;