import { GroupBox } from "@web/component/global/control/group-box/GroupBox"
import { LocaleConfig } from "@web/lib/config/LocaleConfig";
import { RestAuthDataService } from "@web/lib/module/api-module/RestAuthDataService";
import { AuthProvider } from "@web/lib/module/auth/AuthProvider";
import { ServerLocaleInitializer } from "@web/lib/module/locale/ServerLocaleInitializer";
import { cookies } from "next/headers";
import { FcHighPriority, FcMindMap } from "react-icons/fc"
import { ProfileEditAccountForm } from "./ProfileEditAccountForm";
import { ServerLocaleProvider } from "@web/lib/module/locale/ServerLocaleProvider";
import { ProfileEditProvider } from "./ProfileEditProvider";
import { ProfileActiveEditButton } from "./ProfileActiveEditButton";
import { ProfileSaveEditButton } from "./ProfileSaveEditButton";

export const ProfileEditAccountWidget = async () => {

    const session = await AuthProvider.current().getSession();
    const locale = await ServerLocaleInitializer.current(LocaleConfig).get({ readCookie: await cookies() });

    const userData = await RestAuthDataService.current(session?.token, locale ?? LocaleConfig.defaultLocale)
        .getSignInUserData()


    const localeProv = ServerLocaleProvider.current(LocaleConfig);



    return (
        <ProfileEditProvider>
            <GroupBox className="cp-widget cp-account-edit-data">
                <div className="cp-widget-header">
                    <div className="cp-widget-title">
                        <FcMindMap />
                        <span>Edit Account Data</span>
                    </div>
                    <div className="cp-widget-action">
                        <ProfileSaveEditButton />
                        <ProfileActiveEditButton />
                    </div>
                </div>
                <div className="cp-widget-content">
                    {
                        userData.data
                            ? <ProfileEditAccountForm
                                userData={userData.data}
                            />
                            : <div className="cp-error-box">
                                <div className="cp-error-icon">
                                    <FcHighPriority size={30} />
                                </div>
                                <div className="cp-error-title">
                                    {await localeProv.translate('page.main.profile.common.error.data-not-found')}
                                </div>
                                <div className="cp-error-desc">
                                    {userData.message}
                                </div>
                            </div>
                    }

                </div>
            </GroupBox>
        </ProfileEditProvider>

    )
}