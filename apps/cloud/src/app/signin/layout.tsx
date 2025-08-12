

import { PropsWithChildren } from "react"
import '@web/assets/styles/layout/signin.layout.scss'
import { SignInLocaleChangeButton } from "@web/component/layout/signin/SignInLocaleChangeButton";

const SignInLayout = (prop: PropsWithChildren) => {
    return (
        <div className="cp-external-layout cp-layout cp-signin-layout">
            {prop.children}



            <SignInLocaleChangeButton />
        </div>
    )
}

export default SignInLayout;   