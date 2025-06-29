'use server'

import { Fragment } from "react"
import { DetectDeviceConfig } from "../device-detect/DetectDeviceConfig"
import { CrepenLoadingBox } from "../../loading/CrepenLoadingBox"
import { UploadMonitorModal } from "../../layout/controls/upload-monitor-modal/UploadMonitorModal"

export const InitSiteConfig = async () => {

    

    return (
        <Fragment>
            <DetectDeviceConfig />


            <CrepenLoadingBox />
            <UploadMonitorModal />
        </Fragment>
    )
}