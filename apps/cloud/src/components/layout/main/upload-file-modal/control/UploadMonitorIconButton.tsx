import { StringUtil } from "@web/lib/util/StringUtil"
import { MouseEvent, ReactNode } from "react"

interface UploadMonitorIconButtonProp {
    className? : string,
    icon : ReactNode,
    onClick? : (e : MouseEvent) => void
}

export const UploadMonitorIconButton = (prop : UploadMonitorIconButtonProp) => {
    return (
        <button className={StringUtil.joinClassName("cp-monitor-item-control cp-action-icon-bt" , prop.className)}
            onClick={prop.onClick}
        >
            {prop.icon}
        </button>
    )
}