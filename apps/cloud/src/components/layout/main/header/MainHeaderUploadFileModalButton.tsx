'use client'

import { Fragment } from "react"
import { FcExternal } from "react-icons/fc"
import { useUploadFileModal } from "../provider/MainUploadFileModalProvider";

export const MainHeaderUploadFileModalButton = () => {

    const uploadFileModalHook = useUploadFileModal();

    return (
        <Fragment>
            <button
                className="cp-header-action-bt cp-header-upload-file-modal-bt"
                onClick={() => {
                    uploadFileModalHook.setModalState(!uploadFileModalHook.isOpen);
                }}
            >
                <FcExternal />
            </button>


        </Fragment>
    )
}

