'use client'

import { ChangeEvent, MouseEvent, useRef } from 'react'
import './FolderUploadFileButton.scss'
import { useFileUploadMonitorVisible } from '@web/modules/common-1/state/useFileUploadMonitorVisible'
import { useFileUploadState } from '@web/modules/common-1/state/useFileUploadState'
import { useFolderData } from '../../../containers/folder-info-provider/FolderDataProvider'

interface AddFolderFileButtonProp {
    onChangeFileList?: (files: File[]) => void,
    loadSelectItemFunc? : (items : {type : 'folder '| 'file' , uid : string}[]) => void
}

export const FolderUploadFileButton = (prop: AddFolderFileButtonProp) => {

    const inputRef = useRef<HTMLInputElement>(null);
    const monitorHook = useFileUploadMonitorVisible();
    const uploadHook = useFileUploadState();
    const folderDataHook = useFolderData();


    const buttonEventHandler = {
        onClick: (e: MouseEvent<HTMLButtonElement>) => {
            inputRef.current?.click();
        }
    }

    const inputEventHandler = {
        onChange: (e: ChangeEvent<HTMLInputElement>) => {
          
            const fileList = Array.from<File>(e.currentTarget.files ?? [])
       
            e.target.value='';


            uploadHook.uploadData(fileList , folderDataHook.uid , folderDataHook.folderTitle );

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