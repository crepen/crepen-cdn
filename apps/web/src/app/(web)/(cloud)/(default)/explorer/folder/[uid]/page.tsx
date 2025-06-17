'use server'

import { CrepenFolderOperationService } from "@web/services/operation/folder.operation.service"
import '@web/assets/style/cloud/page/folder/cloud.folder.scss'
import { MoveParentFolderButton } from "@web/components/page/folder/move-parent-button.folder"
import { CrepenHttpService } from "@web/services/common/http.service"
import { FolderObjectButton } from "@web/components/page/folder/folder-button.folder"
import { AddFolderButton } from "@web/components/page/folder/add-folder-button.folder"
import Link from "next/link"

interface ExplorerFolderRoutePageProp {
    params: Promise<{
        uid?: string
    }>
}

export const ExplorerFolderRoutePage = async (prop: ExplorerFolderRoutePageProp) => {


    const url = await CrepenHttpService.getUrl();


    const targetFolderUid = (await prop.params).uid;

    const folderData = await CrepenFolderOperationService.getFolderData(targetFolderUid, true);

    const folderBaseUrl = new URL('./', url).toString();

    return (
        <div className="cp-common-page cp-folder-page">
            <div className="cp-page-header">
                <div className="name">
                    <strong>{folderData.data?.info.folderTitle}</strong>
                </div>

            </div>
            <div className="cp-folder-context">
                <div className="cp-folder-toolbar">
                    <div className="left-align">
                        <MoveParentFolderButton
                            parentUid={folderData.data?.info.parentFolderUid}
                            folderBaseUrl={folderBaseUrl}
                        />
                    </div>

                    <div className="right-align">
                        <AddFolderButton
                            parentFolderUid={folderData.data?.info.uid}
                        />
                        <Link href={`/explorer/file/add?folder=${folderData.data?.info.uid}`}>
                            <button>Add Files</button>
                        </Link>

                    </div>
                </div>
                <div className="cp-child-folder-list">
                    {
                        (folderData.data?.children?.folder ?? [])
                            .sort((x, y) => x.folderTitle < y.folderTitle ? -1 : 1)
                            .map(folderInfoData => (
                                <FolderObjectButton
                                    key={folderInfoData.uid}
                                    folderInfo={folderInfoData}
                                    folderBaseUrl={folderBaseUrl}
                                />
                            ))
                    }
                </div>
                <div className="cp-child-file-list">
                    FILE
                </div>
            </div>
        </div>
    )
}

export default ExplorerFolderRoutePage;