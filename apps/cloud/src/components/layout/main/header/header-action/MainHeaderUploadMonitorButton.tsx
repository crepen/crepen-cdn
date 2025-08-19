'use client'

import { FcExternal } from "react-icons/fc"
import { MainHeaderActionButton } from "./MainHeaderActionButton"
import { useUploadFileModal } from "../../provider/MainUploadFileModalProvider";
import { StringUtil } from "@web/lib/util/StringUtil";
import { useMainUploadFile } from "../../provider/MainUploadFileProvider";

export const MainHeaderUploadMonitorButton = () => {

    const uploadFileModalHook = useUploadFileModal();
    const updateHook = useMainUploadFile();

    return (
        <MainHeaderActionButton
            className={StringUtil.joinClassName(
                'cp-upload-file-modal-bt' ,
                 uploadFileModalHook.isOpen ? 'active' : '' , 
                 updateHook.files.find(x=>x.uploadState === 'UPLOADING') ? 'cp-running' : ''
                )}
            icon={<FcExternal fontSize={20} />}
            text="Upload Monitor"
            mode="both"
            onClick={() => {
                uploadFileModalHook.setModalState(!uploadFileModalHook.isOpen);
            }}
        />
    )
}