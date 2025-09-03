'use client'

import { FcExternal } from "react-icons/fc"
import { MainHeaderActionButton } from "./MainHeaderActionButton"
import { useUploadFileModal } from "../../provider/MainUploadFileModalProvider";
import { StringUtil } from "@web/lib/util/StringUtil";
import { useMainUploadFile } from "../../provider/MainUploadFileProvider";
import { useEffect } from "react";

export const MainHeaderUploadMonitorButton = () => {

    const uploadFileModalHook = useUploadFileModal();
    const updateHook = useMainUploadFile();

    useEffect(() => {
        if(updateHook.files.length === 0){
            uploadFileModalHook.setModalState(false);
        }
    },[updateHook])

    return (
        <MainHeaderActionButton
            className={StringUtil.joinClassName(
                'cp-upload-file-modal-bt' ,
                 uploadFileModalHook.isOpen ? 'active' : '' , 
                 updateHook.files.find(x=>x.uploadState === 'UPLOADING') ? 'cp-running' : '',
                 updateHook.files.length === 0 ? 'cp-hidden' : ''
                )}
            icon={<FcExternal fontSize={20} />}
            text="Upload Monitor"
            mode="both"
            onClick={() => {
                if(updateHook.files.length !== 0){
                    uploadFileModalHook.setModalState(!uploadFileModalHook.isOpen);
                }
            }}
        />
    )
}