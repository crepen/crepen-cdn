import { PropsWithChildren } from "react"
import '@web/assets/styles/layout/signin.layout.scss'

const SignInLayout = (prop: PropsWithChildren) => {
    return (
        <div className="cp-external-layout cp-layout cp-signin-layout">
            {prop.children}
        </div>
    )
}

export default SignInLayout;   