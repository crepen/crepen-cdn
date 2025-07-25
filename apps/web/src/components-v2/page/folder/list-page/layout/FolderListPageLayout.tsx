import './FolderListPageLayout.scss'

import { CrepenFolder } from "@web/modules/crepen/explorer/folder/dto/CrepenFolder"
import { PropsWithClassName } from "@web/modules/common/type/common.component"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder } from '@fortawesome/free-regular-svg-icons'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { FolderItemListContainer } from '../containers/folder-item-list/FolderItemListContainer'
import { FolderSelectItemProvider } from '../containers/folder-select-item-provider/FolderSelectItemProvider'
import { FolderPageToolbar } from '../containers/folder-page-toopbar/FolderPageToolbar'
import { FolderDataProvider } from '../containers/folder-info-provider/FolderDataProvider'

interface FolderListPageLayoutProp extends PropsWithClassName {
    data: CrepenFolder
}

export const FolderListPageLayout = (prop: FolderListPageLayoutProp) => {

    return (
        <div className="cp-page-layout cp-folder-list-page-layout">
            <FolderDataProvider folderData={prop.data}>
                <FolderSelectItemProvider>
                    <div className='cp-page-header'>
                        <div className='cp-page-title'>
                            <FontAwesomeIcon
                                icon={faFolder}
                                className='cp-title-folder-icon'
                            />
                            <span>{prop.data.folderTitle}</span>
                            <Link href={`/explorer/folder/${prop.data.uid}/setting`}>
                                <FontAwesomeIcon
                                    icon={faCircleInfo}
                                    className='cp-title-info-icon'
                                />
                            </Link>
                        </div>
                        <FolderPageToolbar />
                    </div>
                    <div className='cp-page-content'>
                        <FolderItemListContainer
                            dataList={[
                                ...((prop.data.files ?? []).map(x => ({ type: 'file', data: x }))),
                                ...((prop.data.childFolder ?? []).map(x => ({ type: 'folder', data: x })))
                            ]}
                        />

                    </div>
                    <div className='cp-page-footer'>
                        {/* <span>1</span> */}
                    </div>
                </FolderSelectItemProvider>
            </FolderDataProvider>

        </div>
    )
}