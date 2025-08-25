import { CommonPage } from "@web/component/global/CommonPage";
import { GroupBox } from "@web/component/global/control/group-box/GroupBox";
import { ProfileEditAccountWidget } from "@web/component/page/main/profile/account/ProfileEditAccountWidget";
import { ProfileDashboardStoreWidget } from "@web/component/page/main/profile/dashboard/ProfileDashboardStoreWidget";
import { Suspense } from "react";
import { FcDataConfiguration, FcFile } from "react-icons/fc";

const MainProfileAccountPage = () => {
    return (
        <CommonPage
            className="cp-profile-account-page"

        >
            <Suspense>
                <ProfileEditAccountWidget />
            </Suspense>
        </CommonPage>
    )
}

export default MainProfileAccountPage;