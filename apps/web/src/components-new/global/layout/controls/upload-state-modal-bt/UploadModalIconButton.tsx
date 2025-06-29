'use client'

import './UploadModalIconButton.scss'
import { faDownload } from "@fortawesome/free-solid-svg-icons"
import { CrepenIconButton } from "@web/components/control/icon-button/icon-button.control"
import { useFileUploadMonitorVisible } from "@web/modules/common/state/useFileUploadMonitorVisible"
import { useFileUploadState } from '@web/modules/common/state/useFileUploadState'
import { Fragment } from "react"

export const UploadModalIconButton = () => {

    const monitorHook = useFileUploadMonitorVisible();
    const uploadFileHook = useFileUploadState();

    return (
        <CrepenIconButton
            className="upload-monitor-active-bt"
            icon={faDownload}
            onClick={() => {
                monitorHook.changeState(!monitorHook.value);
            }}
            overrideAttr={{
                'data-file-length':
                    uploadFileHook.value.length > 0
                        ? uploadFileHook.value.length.toString()
                        : undefined
            }}
        >

        </CrepenIconButton>
    )
}