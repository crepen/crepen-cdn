'use client'

import { useMainUploadFile } from "@web/component/layout/main/provider/MainUploadFileProvider";
import { useClientLocale } from "@web/lib/module/locale/ClientLocaleProvider";
import { UploadFileObject } from "@web/lib/types/entity/ClientUploadFile";
import { ChangeEvent, Fragment, useRef } from "react";
import { FcExternal } from "react-icons/fc"
import uuid from "react-uuid";

interface ExplorerFileUploadButtonProp {
    folderUid?: string
}

export const ExplorerFileUploadButton = (prop: ExplorerFileUploadButtonProp) => {
    const translateHook = useClientLocale();
    const uploadFileHook = useMainUploadFile();
    const inputRef = useRef<HTMLInputElement>(null);


    const buttonClickEventHandler = () => {
        if (inputRef.current) {
            inputRef.current.value = ''
            inputRef.current.click();
        }

    }

    const inputChangeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if (prop.folderUid) {
            if ((e.currentTarget.files ?? []).length > 0) {

                const uploadItems : UploadFileObject[] = [];

                for (const item of (e.currentTarget.files ?? [])) {
                    const fileObj : UploadFileObject = {
                        file : item,
                        parentFolderUid : prop.folderUid,
                        timestamp : new Date().getTime(),
                        uploadState : 'WAIT',
                        uuid : uuid(),
                        errorMessage : undefined
                    }

                    uploadItems.push(fileObj);
                }


                uploadFileHook.addQueue(...uploadItems);

                e.currentTarget.value = '';
            }
        }




    }

    return (
        prop.folderUid
            ? (
                <Fragment>
                    <button className='cp-header-bt cp-upload-file-bt' onClick={buttonClickEventHandler}>
                        <div className='cp-button-icon'>
                            <FcExternal />
                        </div>
                        <div className='cp-button-text'>
                            {translateHook.translate('page.main.explorer.header.button.uploadfile')}
                        </div>
                    </button>


                    <input type="file" multiple hidden ref={inputRef} onChange={inputChangeEventHandler} />
                </Fragment>
            )
            : undefined
    )
}