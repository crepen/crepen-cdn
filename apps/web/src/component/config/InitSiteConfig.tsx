'use server'

import { Fragment } from "react"
import { UploadMonitorModal } from "../../components-new/global/layout/controls/upload-monitor-modal/UploadMonitorModal"

export const InitSiteConfig = async () => {

    return (
        <Fragment>
            <UploadMonitorModal />
        </Fragment>
    )
}