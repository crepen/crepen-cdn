'use client'

import './UploadModalIconButton.scss'
import { faDownload } from "@fortawesome/free-solid-svg-icons"
import { useFileUploadMonitorVisible } from "@web/modules/common-1/state/useFileUploadMonitorVisible"
import { useFileUploadState } from '@web/modules/common-1/state/useFileUploadState'
import { CrepenIconButton } from '../../../../../component/common/icon-button/icon-button.control'

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