'use client'

import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FolderAction } from '@web/lib/action';
import { Fragment, useRef, useState, useEffect, Dispatch, SetStateAction, useActionState } from 'react'

interface AddFolderButtonProp {
    parentFolderUid?: string
}

export const AddFolderButton = (prop: AddFolderButtonProp) => {

    const [isModalOpen, setModalState] = useState<boolean>(false);

    const clickHandler = () => {
        setModalState(true);
    }

    return (
        <Fragment>
            <button
                className='cp-add-folder-button'
                onClick={clickHandler}
            >
                Add Folder
            </button>
            {
                isModalOpen &&
                <AddFolderModal
                    isOpen={isModalOpen}
                    setOpenState={setModalState}
                    parentFolderUid={prop.parentFolderUid}
                />
            }

        </Fragment>

    )
}

interface AddFolderModalProp {
    isOpen?: boolean,
    setOpenState?: Dispatch<SetStateAction<boolean>>,
    parentFolderUid?: string
}

const AddFolderModal = (prop: AddFolderModalProp) => {

    const inputRef = useRef<HTMLInputElement>(null);

    const closeClickHandler = () => {
        if (prop.setOpenState) prop.setOpenState(false);
    }

    const [state, formAction, isPending] = useActionState(FolderAction.addFolder, {
        success: undefined,
        message: undefined,
        lastValue: undefined
    })

    useEffect(() => {
        inputRef.current?.focus()
    }, [])

    useEffect(() => {
        if (isPending === false && state?.success !== undefined) {
            if (state.success !== true) {
                if (inputRef.current) {
                    inputRef.current.value = state.lastValue ?? ''
                }

                alert(state.message);
            }
            else {
                alert(state.message);
                // if(prop.setOpenState) prop.setOpenState(false);
                location.reload();
            }
        }
    }, [isPending, state])

    return (
        <div className={'cp-add-folder-modal'}>
            <div className='cp-backplate' onClick={closeClickHandler} />
            <div className='cp-modal' >
                <div className='cp-modal-header'>
                    <span>Add Folder</span>
                    <button className='cp-modal-close-button'
                        onClick={() => {
                            if (prop.setOpenState) prop.setOpenState(false)
                        }}
                    >
                        <FontAwesomeIcon icon={faXmark} size='lg' />
                    </button>

                </div>
                <div className='cp-modal-context'>
                    <form action={formAction}>
                        <input type='text' ref={inputRef} name='folder-title' />
                        <input type='hidden' name='parent-folder-uid' value={prop.parentFolderUid ?? ''} />
                        <button type='submit'> {isPending ? 'LOADING' : 'SUBMIT'} </button>
                    </form>
                </div>




            </div>
        </div>
    )
}