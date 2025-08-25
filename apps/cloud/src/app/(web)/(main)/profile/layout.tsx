import { CommonLayout } from "@web/component/global/CommonLayout";
import { LocaleConfig } from "@web/lib/config/LocaleConfig";
import { ServerLocaleProvider } from "@web/lib/module/locale/ServerLocaleProvider";
import { Metadata } from "next";
import { PropsWithChildren } from "react";

import '@web/assets/styles/page/main/profile/profile.main.scss'
import { GroupBox } from "@web/component/global/control/group-box/GroupBox";
import { AuthProvider } from "@web/lib/module/auth/AuthProvider";
import { RestUserDataService } from "@web/lib/module/api-module/RestUserDataService";
import { ServerLocaleInitializer } from "@web/lib/module/locale/ServerLocaleInitializer";
import { cookies } from "next/headers";
import { RestAuthDataService } from "@web/lib/module/api-module/RestAuthDataService";
import Link from "next/link";
import { FcIpad, FcPortraitMode, FcSettings } from "react-icons/fc";
import { StringUtil } from "@web/lib/util/StringUtil";
import { ProfileNavigation, ProfileNavigationItem } from "@web/component/page/main/profile/ProfileNavigation";

export const generateMetadata = async (): Promise<Metadata> => {
    const localeProv = ServerLocaleProvider.current(LocaleConfig);

    return {
        title: await localeProv.translate('title.profile')
    }
}



const MainProfileLayout = async (prop: PropsWithChildren) => {

    const session = await AuthProvider.current().getSession();
    const locale = await ServerLocaleInitializer.current(LocaleConfig).get({ readCookie: await cookies() });

    const userData = await RestAuthDataService.current(session?.token, locale ?? LocaleConfig.defaultLocale)
        .getSignInUserData()



    return (
        <CommonLayout className="cp-profile-layout">
            <div className="cp-profile-box">
                <div className="cp-side">
                    <GroupBox className="cp-side-card" >

                        <div className="cp-profile-icon">
                            <div className="cp-profile-avartar">
                                {userData.data?.name.slice(0, 1)}
                            </div>
                        </div>
                        <div className="cp-profile-name">
                            {userData.data?.name}
                        </div>
                        <div className="cp-profile-email">
                            {userData.data?.email}
                        </div>
                    </GroupBox>
                </div>
                <div className="cp-content">
                    <GroupBox className="cp-nav">
                        <ProfileNavigation>
                            <ProfileNavigationItem
                                title="Dashboard"
                                icon={<FcIpad />}
                                link="/profile/dashboard"
                            />
                            <ProfileNavigationItem
                                title="Account"
                                icon={<FcPortraitMode />}
                                link="/profile/account"
                            />
                            <ProfileNavigationItem
                                title="Setting"
                                icon={<FcSettings />}
                                link="/profile/setting"
                            />
                        </ProfileNavigation>

                    </GroupBox>
                    <div className="cp-page-wrapper">
                        {prop.children}
                    </div>
                </div>

            </div>

        </CommonLayout>
    )
}

export default MainProfileLayout;