'use client'

import { ChangeEvent, MouseEvent, useRef } from 'react'
import './FolderUploadFileButton.scss'
import { useFileUploadMonitorVisible } from '@web/modules/common/state/useFileUploadMonitorVisible'

interface AddFolderFileButtonProp {
    onChangeFileList?: (files: File[]) => void
}

/** @deprecated */
export const FolderUploadFileButton = (prop: AddFolderFileButtonProp) => {

    const inputRef = useRef<HTMLInputElement>(null);
    const monitorHook = useFileUploadMonitorVisible();


    const buttonEventHandler = {
        onClick: (e: MouseEvent<HTMLButtonElement>) => {
            inputRef.current?.click();
        }
    }

    const inputEventHandler = {
        onChange: (e: ChangeEvent<HTMLInputElement>) => {
            // console.log(e.currentTarget.files);
            const fileList = Array.from<File>(e.currentTarget.files ?? [])
            if (prop.onChangeFileList) prop.onChangeFileList(fileList);
            e.target.value='';

            monitorHook.changeState(true)
        }
    }

    return (
        <button
            className="cp-button cp-add-file-bt"
            onClick={buttonEventHandler.onClick}
        >
            <span>Upload File</span>
            <input
                type="file"
                className="cp-file-input"
                ref={inputRef}
                onChange={inputEventHandler.onChange}
                multiple
            />
        </button>
    )
}