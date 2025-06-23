'use client'

import { Fragment, PropsWithChildren } from 'react';
import { FolderCategoryExpandGroup } from './base.category-group.folder';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { FastAddFileModalButton } from '../../file/fast-add/fast-add-button.file';
import { CrepenFolder } from '@web/services/types/object/folder.object';

interface FileListCategoryGroupProp extends PropsWithChildren {
    folderData?: CrepenFolder
}

export const FileListCategoryGroup = (prop: FileListCategoryGroupProp) => {
    return (
        <FolderCategoryExpandGroup
            title="Files"
            className='cp-file-category-group'
            actions={
                <Fragment>
                    <FastAddFileModalButton
                        // value="Add File (Fast)"
                        folderUid={prop.folderData?.uid}
                    />
                    {/* <FontAwesomeIcon
                        icon={faAdd}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                    /> */}
                </Fragment>
            }
        >
            {prop.children}
        </FolderCategoryExpandGroup>
    )
}