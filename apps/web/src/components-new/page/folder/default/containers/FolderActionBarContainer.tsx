'use client'

import { CrepenFolder } from "@web/modules/crepen/explorer/folder/dto/CrepenFolder"
import { FolderUploadFileButton } from "../controls/add-file-button/FolderUploadFileButton"
import { useFileUploadState } from "@web/modules/common/state/useFileUploadState"
import { FolderAddChildFolderButton } from "../controls/add-folder-button/FolderAddChildFolderButton"

interface FolderActionBarContainerProp {
    data?: CrepenFolder
}

export const FolderActionBarContainer = (prop: FolderActionBarContainerProp) => {

    const uploadHook = useFileUploadState();

    return (
        <div className="cp-folder-action-bar">
            {
                prop.data !== undefined &&
                <FolderAddChildFolderButton
                    folderData={prop.data}
                />
            }

            {
                (prop.data !== undefined && prop.data !== null) &&
                <FolderUploadFileButton
                    onChangeFileList={(files: File[]) => {
                        uploadHook.uploadData(files, prop.data!);
                    }}
                />
            }

        </div>
    )
}