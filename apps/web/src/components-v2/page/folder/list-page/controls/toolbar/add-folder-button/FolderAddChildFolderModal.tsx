import { useCrepenGlobalModal } from '@web/components-v2/page/(global)/config/global-modal/CrepenGlobalModalProvider';
import './FolderAddChildFolderModal.scss'
import { RefObject, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { StringUtil } from '@web/lib/util/string.util';

interface FolderAddChildFolderModalProp {
    onSubmit: (folderTitle?: string) => void
    ref?: RefObject<FolderAddChildFolderModalRefProp | null>
}

export interface FolderAddChildFolderModalRefProp {
    setErrorMessage: (msg: string) => void
}

export const FolderAddChildFolderModal = (prop: FolderAddChildFolderModalProp) => {

    useImperativeHandle(prop.ref, () => ({
        setErrorMessage: (msg) => {
            setErrorMessage(msg);
        }
    }))

    const [errorMessage, setErrorMessage] = useState<string | undefined>();

    const globalModalHook = useCrepenGlobalModal();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    },[])

    return (
        <div className='cp-add-folder-modal'>
            <div className='cp-modal-header'>
                <span>Add Folder</span>
            </div>
            <div className='cp-modal-content'>
                <div className='cp-input-box'>
                    <span className='cp-input-label'>Folder title</span>
                    <input
                        type='text'
                        className='cp-folder-title-input'
                        ref={inputRef}
                        onChange={() => {
                            setErrorMessage(undefined)
                        }}
                        onKeyUp={(e) => {
                            console.log(e.key)
                            if (e.key === 'Enter') {
                                if (prop.onSubmit) {
                                    prop.onSubmit(inputRef.current?.value)
                                }
                            }
                        }}
                    />
                    {
                        !StringUtil.isEmpty(errorMessage) &&
                        <span className='cp-modal-error'>
                            {errorMessage}
                        </span>
                    }

                </div>
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
                            prop.onSubmit(inputRef.current?.value)
                        }
                    }}
                >
                    Submit
                </button>
            </div>


        </div>
    )
}