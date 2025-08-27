import { CommonPage } from "@web/component/global/CommonPage";
import { GroupBox } from "@web/component/global/control/group-box/GroupBox";
import { ProfileDashboardStoreWidget } from "@web/component/page/main/profile/dashboard/ProfileDashboardStoreWidget";
import { ProfileTrafficChartWidget } from "@web/component/page/main/profile/dashboard/ProfileTrafficChartWidget";
import { Suspense } from "react";
import { FcDataConfiguration, FcFile } from "react-icons/fc";

const MainProfileDashboardPage = () => {
    return (
        <CommonPage
            className="cp-profile-dashboard-page"

        >
            <CommonPage.Wrapper
                noPadding
            >
                <Suspense>
                    <ProfileDashboardStoreWidget />
                </Suspense>
                <Suspense>
                    <ProfileTrafficChartWidget />
                </Suspense>
            </CommonPage.Wrapper>
        </CommonPage>
    )
}

export default MainProfileDashboardPage;