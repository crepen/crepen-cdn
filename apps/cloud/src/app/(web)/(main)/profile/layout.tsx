import { CommonLayout } from "@web/component/global/CommonLayout";
import { LocaleConfig } from "@web/lib/config/LocaleConfig";
import { ServerLocaleProvider } from "@web/lib/module/locale/ServerLocaleProvider";
import { Metadata } from "next";
import { PropsWithChildren } from "react";

import '@web/assets/styles/page/main/profile/profile.main.scss'
import { GroupBox } from "@web/component/global/control/group-box/GroupBox";
import { AuthProvider } from "@web/lib/module/auth/AuthProvider";

export const generateMetadata = async (): Promise<Metadata> => {
    const localeProv = ServerLocaleProvider.current(LocaleConfig);

    return {
        title: await localeProv.translate('title.profile')
    }
}



const MainProfileLayout = async (prop: PropsWithChildren) => {

    const session = await AuthProvider.current().getSession();

    return (
        <CommonLayout className="cp-profile-layout">
            <div className="cp-profile-box">
                <div className="cp-side">
                    <GroupBox className="cp-side-card" >
                        {session?.token?.accessToken}
                    </GroupBox>
                </div>
                <div className="cp-content">
                    <GroupBox className="cp-nav">

                    </GroupBox>
                    <GroupBox>
                        {prop.children}
                    </GroupBox>

                </div>

            </div>

        </CommonLayout>
    )
}

export default MainProfileLayout;