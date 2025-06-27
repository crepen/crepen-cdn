'use server'

import { CommonDefaultPageContainer } from '../../common/CommonDefaultPageContainer'
import './FolderDefaultPageContainer.scss'
import { Fragment } from 'react'
import { FolderFileListContainer } from './containers/FolderFileListContainer'
import { CrepenFolder } from '@web/modules/crepen/explorer/folder/dto/CrepenFolder'

interface FolderDefaultPageContainerProp {
    data?: CrepenFolder
}

export const FolderDefaultPageContainer = async (prop: FolderDefaultPageContainerProp) => {

    return (
        <Fragment>
            <CommonDefaultPageContainer
                className='cp-folder-default-page'
                title={prop.data?.folderTitle}
            >
                <div className='cp-folder-action'>

                </div>
                <FolderFileListContainer
                    data={prop.data}
                />
            </CommonDefaultPageContainer>


        </Fragment>

    )
}