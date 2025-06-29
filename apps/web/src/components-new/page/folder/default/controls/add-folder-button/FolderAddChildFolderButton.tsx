'use client'

import { CrepenFolder } from '@web/modules/crepen/explorer/folder/dto/CrepenFolder';
import './FolderAddChildFolderButton.scss';
import { MouseEvent } from 'react';
import { FolderAction } from '@web/lib/action';
import { CrepenFolderAddChildFolder } from '@web/modules/crepen/explorer/folder/action/CrepenFolderAction';
import { StringUtil } from '@web/lib/util/string.util';
import { useGlobalLoadingState } from '@web/lib/state/global.state';

interface FolderAddChildFolderButtonProp {
    folderData: CrepenFolder
}

/** @deprecated */
export const FolderAddChildFolderButton = (prop: FolderAddChildFolderButtonProp) => {

    const loadingHook = useGlobalLoadingState();

    const buttonEventHandler = {
        onClick: (e: MouseEvent<HTMLButtonElement>) => {

            loadingHook.active(true)

            const formData = new FormData();
            formData.set('title', StringUtil.randomString(10));
            formData.set('parent-folder-uid', prop.folderData.uid);



            CrepenFolderAddChildFolder(formData)
                .then(res => {
                    loadingHook.active(false)
                })
                .catch(e => {
                    loadingHook.active(false)
                })

        }
    }

    return (
        <button
            onClick={buttonEventHandler.onClick}
        >
            Add Folder
        </button>
    )
}