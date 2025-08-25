import { GroupBox } from "@web/component/global/control/group-box/GroupBox"
import { StringUtil } from "@web/lib/util/StringUtil"
import { FcDataConfiguration, FcMindMap, FcMultipleSmartphones } from "react-icons/fc"

export const ProfileDashboardStoreWidget = () => {
    return (
        <GroupBox className="cp-widget cp-dashboard-statistics">
            <div className="cp-widget-header">
                <div className="cp-widget-title">
                    <FcDataConfiguration />
                    <span>Store</span>
                </div>
            </div>
            <div className="cp-widget-content">
                <StoreGrid />
            </div>
        </GroupBox>
    )
}


const StoreGrid = () => {
    return (
        <div className="cp-widget-grid cp-store-grid">
            <div className="cp-file-count cp-grid-item">
                <div className="cp-grid-title">
                    <FcMultipleSmartphones size={20} />
                    <span>Total File Count</span>
                </div>
                <div className="cp-grid-value">
                    <span>1</span>
                </div>
            </div>
            <div className="cp-file-traffic cp-grid-item">
                <div className="cp-grid-title">
                    <FcMindMap size={20} />
                    <span>Traffic</span>
                </div>
                <div className="cp-grid-value">
                    <span>
                        {StringUtil.convertFormatByte(1)}
                    </span>
                </div>
            </div>
        </div>
    )
}


