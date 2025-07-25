import { RefObject, useImperativeHandle, useRef, useState } from 'react'
import './FolderRemoveItemModal.scss'
import { useGlobalModal } from '../../../../../../../component/config/GlobalModalProvider';
import { useSelectFolderItem } from '../../../containers/folder-select-item-provider/FolderSelectItemProvider';


interface FolderRemoveItemModalProp {
    onSubmit: () => void,
    removeFileCount : number
    removeFolderCount : number
}



export const FolderRemoveItemModal = (prop : FolderRemoveItemModalProp) => {
   
    
    const globalModalHook = useGlobalModal();

    return (
        <div className='cp-remove-item-modal'>
            <div className='cp-modal-header'>
                <span>Remove Items</span>
            </div>
            <div className='cp-modal-content'>
                Remove {prop.removeFileCount + prop.removeFolderCount} Items? (File : {prop.removeFileCount} , Folder : {prop.removeFolderCount})
            </div>
            <div className='cp-modal-footer'>
                <button
                    className='cp-cancle-bt'
                    onClick={() => globalModalHook.close()}
                >
                    Cancle
                </button>
                <button
                    className='cp-submit-bt'
                    onClick={() => {
                        if (prop.onSubmit) {
                            prop.onSubmit()
                        }
                    }}
                >
                    Submit
                </button>
            </div>


        </div>
    )
}