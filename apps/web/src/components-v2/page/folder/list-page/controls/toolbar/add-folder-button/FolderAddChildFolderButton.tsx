'use client'

import './FolderAddChildFolderButton.scss';
import { MouseEvent, useRef } from 'react';
import { useFolderData } from '../../../containers/folder-info-provider/FolderDataProvider';
import { useGlobalModal } from '../../../../../../../component/config/GlobalModalProvider';
import { FolderAddChildFolderModal, FolderAddChildFolderModalRefProp } from './FolderAddChildFolderModal';
import { CrepenFolderAddChildFolder } from '@web/modules/crepen/service/explorer/folder/action/CrepenFolderAction';
import { useGlobalLoading } from '@web/component/config/GlobalLoadingProvider';

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
        formData.set('parent-folder-uid', folderDataHook.uid);

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
                console.log(e);
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