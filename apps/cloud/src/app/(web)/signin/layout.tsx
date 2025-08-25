

import { PropsWithChildren } from "react"
import '@web/assets/styles/layout/signin.layout.scss'
import { SignInLocaleChangeButton } from "@web/component/layout/signin/SignInLocaleChangeButton";
import { LocaleConfig } from "@web/lib/config/LocaleConfig";
import { ServerLocaleProvider } from "@web/lib/module/locale/ServerLocaleProvider";
import { Metadata } from "next";
import { CommonLayout } from "@web/component/global/CommonLayout";




const SignInLayout = (prop: PropsWithChildren) => {
    return (
        <CommonLayout className="cp-signin-layout">
            <div className="cp-content-box">
                {prop.children}
            </div>
            <SignInLocaleChangeButton />
        </CommonLayout>
    )
}

export default SignInLayout;   