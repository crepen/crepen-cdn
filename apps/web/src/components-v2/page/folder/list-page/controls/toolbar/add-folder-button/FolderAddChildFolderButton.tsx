'use client'

import { CrepenFolder } from '@web/modules/crepen/explorer/folder/dto/CrepenFolder';
import './FolderAddChildFolderButton.scss';
import { Fragment, MouseEvent, useRef } from 'react';
import { FolderAction } from '@web/lib/action';
import { CrepenFolderAddChildFolder } from '@web/modules/crepen/explorer/folder/action/CrepenFolderAction';
import { StringUtil } from '@web/lib/util/string.util';
import { useGlobalLoadingState } from '@web/lib/state/global.state';
import { useFolderData } from '../../../containers/folder-info-provider/FolderDataProvider';
import { useCrepenGlobalModal } from '@web/components-v2/page/(global)/config/global-modal/CrepenGlobalModalProvider';
import { FolderAddChildFolderModal, FolderAddChildFolderModalRefProp } from './FolderAddChildFolderModal';

// interface FolderAddChildFolderButtonProp {
// }

export const FolderAddChildFolderButton = () => {

    const loadingHook = useGlobalLoadingState();
    const folderDataHook = useFolderData();
    const globalModalHook = useCrepenGlobalModal();

    const modalRef = useRef<FolderAddChildFolderModalRefProp>(null);


    const addFolder = (folderTitle: string) => {
        loadingHook.active(true)

        const formData = new FormData();
        formData.set('title', folderTitle);
        formData.set('parent-folder-uid', folderDataHook.uid);

        CrepenFolderAddChildFolder(formData)
            .then(res => {
                if(res.success){
                    globalModalHook.close();
                }
                else{
                    modalRef.current?.setErrorMessage(res.message ?? 'Unknown Error')
                }

                  loadingHook.active(false)
            })
            .catch(e => {
                console.log(e);
                modalRef.current?.setErrorMessage((e as Error).message)
                loadingHook.active(false)
            })

        
    }

    const buttonEventHandler = {
        onClick: (e: MouseEvent<HTMLButtonElement>) => {


            globalModalHook.setOpen(
                <FolderAddChildFolderModal
                    ref={modalRef}
                    onSubmit={(value) => {
                        addFolder(value ?? '');
                    }}
                />
            )





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