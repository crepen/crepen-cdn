'use client'

import './FolderAddChildFolderButton.scss';
import { MouseEvent, useRef } from 'react';
import { FolderAddChildFolderModal, FolderAddChildFolderModalRefProp } from './FolderAddChildFolderModal';
import { CrepenFolderAddChildFolder } from '@web/modules/server/action/FolderAction';
import { useGlobalLoading } from '@web/component/config/GlobalLoadingProvider';
import { useFolderData } from '../../../containers/folder-info-provider/FolderDataProvider';
import { useGlobalModal } from '@web/component/config/GlobalModalProvider';

// interface FolderAddChildFolderButtonProp {
// }

export const FolderAddChildFolderButton = () => {

    const loadingHook = useGlobalLoading();
    const folderDataHook = useFolderData();
    const globalModalHook = useGlobalModal();

    const modalRef = useRef<FolderAddChildFolderModalRefProp>(null);


    const addFolder = (folderTitle: string) => {
        loadingHook.setState(true)

        const formData = new FormData();
        formData.set('title', folderTitle);
        formData.set('parent-folder-uid', folderDataHook.uid ?? '');

        CrepenFolderAddChildFolder(formData)
            .then(res => {
                if(res.success){
                    globalModalHook.close();
                }
                else{
                    modalRef.current?.setErrorMessage(res.message ?? 'Unknown Error')
                }

                  loadingHook.setState(false)
            })
            .catch(e => {
                modalRef.current?.setErrorMessage((e as Error).message)
                loadingHook.setState(false)
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