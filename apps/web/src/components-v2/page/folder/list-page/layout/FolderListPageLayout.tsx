import { CrepenShadowGroup } from '@web/components-v2/common/layout/shadow-group/CrepenShadowGroup'
import './FolderListPageLayout.scss'

import { CrepenFolder } from "@web/modules/crepen/explorer/folder/dto/CrepenFolder"
import { PropsWithClassName } from "@web/types/common.component"
import { PropsWithChildren } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder } from '@fortawesome/free-regular-svg-icons'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { FolderItemListContainer } from '../containers/folder-item-list/FolderItemListContainer'
import { FolderAddChildFolderButton } from '../controls/add-folder-button/FolderAddChildFolderButton'
import { StringUtil } from '@web/lib/util/string.util'
import { FolderUploadFileButton } from '../controls/add-file-button/FolderUploadFileButton'

interface FolderListPageLayoutProp extends PropsWithClassName {
    data: CrepenFolder
}

export const FolderListPageLayout = (prop: FolderListPageLayoutProp) => {
    return (
        <div className="cp-page-layout cp-folder-list-page-layout">
            <div className='cp-page-header'>
                <div className='cp-page-title'>
                    <FontAwesomeIcon
                        icon={faFolder}
                        className='cp-title-folder-icon'
                    />
                    <span>Folder List</span>
                    <Link href={`/explorer/folder/${prop.data.uid}/setting`}>
                        <FontAwesomeIcon
                            icon={faCircleInfo}
                            className='cp-title-info-icon'
                        />
                    </Link>
                </div>
                <div className='cp-page-toolbar'>
                    {
                        !StringUtil.isEmpty(prop.data.uid) &&
                        <FolderAddChildFolderButton
                            folderUid={prop.data!.uid!}
                        />
                    }
                    {
                        !StringUtil.isEmpty(prop.data.uid) &&
                        <FolderUploadFileButton 
                            folderUid={prop.data.uid}
                        />
                    }

                </div>
            </div>
            <div className='cp-page-content'>
                <FolderItemListContainer
                    folderUid={prop.data.uid}
                    parentFolderUid={prop.data.parentFolder?.uid}
                    dataList={[
                        ...((prop.data.files ?? []).map(x => ({ type: 'file', data: x }))),
                        ...((prop.data.childFolder ?? []).map(x => ({ type: 'folder', data: x })))
                    ]}
                />

            </div>
            <div className='cp-page-footer'>
                {/* <span>1</span> */}
            </div>

        </div>
    )
}