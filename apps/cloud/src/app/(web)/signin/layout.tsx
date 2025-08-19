

import { PropsWithChildren } from "react"
import '@web/assets/styles/layout/signin.layout.scss'
import { SignInLocaleChangeButton } from "@web/component/layout/signin/SignInLocaleChangeButton";
import { LocaleConfig } from "@web/lib/config/LocaleConfig";
import { ServerLocaleProvider } from "@web/lib/module/locale/ServerLocaleProvider";
import { Metadata } from "next";



export const generateMetadata = async () : Promise<Metadata> => {
     const localeProv = ServerLocaleProvider.current(LocaleConfig);

    return {
        title : await localeProv.translate('title.signin')
    }
}



const SignInLayout = (prop: PropsWithChildren) => {
    return (
        <div className="cp-external-layout cp-layout cp-signin-layout">
            {prop.children}



            <SignInLocaleChangeButton />
        </div>
    )
}

export default SignInLayout;   