'use server'

import { Fragment } from "react"
import { DetectDeviceConfig } from "../device-detect/DetectDeviceConfig"
import { CrepenLoadingBox } from "../../loading/CrepenLoadingBox"
import { UploadMonitorModal } from "../../layout/controls/upload-monitor-modal/UploadMonitorModal"
import { CrepenLanguageService } from "@web/services/common/language.service"
import { LocaleConfig } from "../locale/LocaleConfig"

export const InitSiteConfig = async () => {

    const locale = await CrepenLanguageService.getSessionLocale();

    return (
        <Fragment>
            <DetectDeviceConfig />
            <LocaleConfig 
                locale={locale.data ?? 'en'}
            />

            <CrepenLoadingBox />
            <UploadMonitorModal />
        </Fragment>
    )
}