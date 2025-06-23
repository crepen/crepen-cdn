'use client'

import { Fragment, PropsWithChildren } from 'react'
import { FolderCategoryExpandGroup } from './base.category-group.folder'
import { AddFolderModalButton } from '../add-modal/button.add-modal.folder'
import { CrepenFolder } from '@web/services/types/object/folder.object'


interface FolderListCategoryGroupProp extends PropsWithChildren {
    folderData?: CrepenFolder
}

export const FolderListCategoryGroup = (prop: FolderListCategoryGroupProp) => {
    return (
        <FolderCategoryExpandGroup
            title="Folders"
            className='cp-folder-category-group'
            actions={
                <Fragment>
                    <AddFolderModalButton
                        folderUid={prop.folderData?.uid}
                    />
                </Fragment>
            }
        >
            {prop.children}
        </FolderCategoryExpandGroup>
    )
}