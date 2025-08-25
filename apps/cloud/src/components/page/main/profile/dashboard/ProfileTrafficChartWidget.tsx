import { GroupBox } from "@web/component/global/control/group-box/GroupBox"
import { FcMindMap } from "react-icons/fc"
import { ProfileTrafficChart } from "./ProfileTrafficChart"

export const ProfileTrafficChartWidget = () => {
    return (
        <GroupBox className="cp-widget cp-dashboard-traffic">
            <div className="cp-widget-header">
                <div className="cp-widget-title">
                    <FcMindMap />
                    <span>Traffic Chart</span>
                </div>
            </div>
            <div className="cp-widget-content">
                <ProfileTrafficChart />
            </div>
        </GroupBox>
    )
}