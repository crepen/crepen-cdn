'use server'

import { CrepenFolderOperationService } from "@web/services/operation/folder.operation.service"
import '@web/assets/style/cloud/page/folder/cloud.folder.scss'
import { MoveParentFolderButton } from "@web/components/page/folder/move-parent-button.folder"
import { CrepenHttpService } from "@web/services/common/http.service"
import Link from "next/link"
import { FastAddFileModalButton } from "@web/components/page/file/fast-add/fast-add-button.file"
import { FolderLinkButton } from "@web/components/page/folder/link-button/folder.link-button.folder"
import { AddFolderModalButton } from "@web/components/page/folder/add-modal/button.add-modal.folder"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAdd, faArrowTurnUp, faEllipsisVertical, faGear, faImage } from "@fortawesome/free-solid-svg-icons"
import { StringUtil } from "@web/lib/util/string.util"
import { faFile, faFolder } from "@fortawesome/free-regular-svg-icons"
import { FolderCategoryExpandGroup } from "@web/components/page/folder/category-group/base.category-group.folder"
import { Fragment } from "react"
import { FolderListCategoryGroup } from "@web/components/page/folder/category-group/folder-group.category-group.folder"
import { FileListCategoryGroup } from "@web/components/page/folder/category-group/file.category-group.folder"
import { redirect } from "next/navigation"

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
                <div className="cp-header-title">
                    <strong>{folderData.data?.folderTitle}</strong>
                </div>
                <div className="cp-header-action">
                    <Link href={`/explorer/folder/${folderData.data?.uid}/setting`}>
                        <FontAwesomeIcon icon={faGear} />
                    </Link>
                </div>

            </div>
            <div className="cp-folder-context">
                <FolderListCategoryGroup
                    folderData={folderData.data}
                >
                    <div className="cp-child-folder-list">
                        <div className="cp-folder-header cp-folder-table-row">
                            <div className="cp-folder-icon">
                                {/* <FontAwesomeIcon icon={faImage} /> */}
                            </div>
                            <div className="cp-folder-title">
                                Title
                            </div>
                            {/* <div className="cp-folder-size">
                                Size
                            </div> */}
                            <div className="cp-folder-action">
                            </div>
                        </div>
                        {
                            !StringUtil.isEmpty(folderData.data?.parentFolderUid) &&
                            <Link
                                className="cp-folder-item cp-folder-table-row"
                                href={`/explorer/folder/${folderData.data?.parentFolderUid}`}
                            >
                                <div className="cp-file-icon">
                                    <FontAwesomeIcon icon={faArrowTurnUp} flip="horizontal" />
                                </div>
                                <div className="cp-table-title">
                                    상위 폴더
                                </div>

                            </Link>
                        }

                        {
                            (folderData.data?.childFolder ?? [])
                                .sort((x, y) => x.folderTitle < y.folderTitle ? -1 : 1)
                                .map((folder, idx) => (
                                    <Link
                                        key={idx}
                                        className="cp-folder-item cp-folder-table-row"
                                        href={`/explorer/folder/${folder.uid}`}
                                    >
                                        <div className="cp-file-icon">
                                            <FontAwesomeIcon icon={faFolder} />
                                        </div>
                                        <div className="cp-table-title">
                                            {folder.folderTitle}
                                        </div>
                                        <div className="cp-file-action">
                                            <FontAwesomeIcon icon={faEllipsisVertical} />
                                        </div>
                                    </Link>
                                ))


                        }

                        {
                            (folderData.data?.childFolder ?? []).length === 0 &&
                            <div className="cp-folder-table-row cp-folder-no-data">No Data</div>
                        }
                    </div>

                </FolderListCategoryGroup>

                <FileListCategoryGroup
                    folderData={folderData.data}
                >
                    <div className="cp-child-file-list">
                        <div className="cp-file-header cp-file-table-row">
                            <div className="cp-file-icon">
                                {/* <FontAwesomeIcon icon={faImage} /> */}
                            </div>
                            <div className="cp-table-title">
                                Title
                            </div>
                            <div className="cp-file-size">
                                Size
                            </div>
                            <div className="cp-file-action">
                            </div>
                        </div>
                        {
                            (folderData.data?.files ?? [])
                                .sort((x, y) => x.fileTitle < y.fileTitle ? -1 : 1)
                                .map((crepenFile, idx) => (
                                    <Link
                                        key={idx}
                                        className="cp-file-item cp-file-table-row"
                                        href={`/explorer/file/${crepenFile.uid}`}
                                    >
                                        <div className="cp-file-icon">
                                            {
                                                crepenFile.fileStore?.fileType.split('/')[0] === 'image'
                                                    ? <FontAwesomeIcon icon={faImage} />
                                                    : <FontAwesomeIcon icon={faFile} />
                                            }
                                        </div>
                                        <div className="cp-table-title">
                                            {crepenFile.fileTitle}
                                        </div>
                                        <div className="cp-file-size">
                                            {StringUtil.convertFormatByte(crepenFile.fileStore?.fileSize ?? 0)}
                                        </div>
                                        <div className="cp-file-action">
                                            <FontAwesomeIcon icon={faEllipsisVertical} />
                                        </div>
                                    </Link>
                                ))


                        }

                        {
                            (folderData.data?.files ?? []).length === 0 &&
                            <div className="cp-file-table-row cp-file-no-data">No Data</div>
                        }
                    </div>
                </FileListCategoryGroup>


            </div>
        </div>
    )
}

export default ExplorerFolderRoutePage;