import './modal.add-modal.folder.scss'
import { useEffect, useRef, useState } from "react"
import { CrepenModal } from "../../common/base-modal.common"
import { StringUtil } from '@web/lib/util/string.util'
import { CrepenActionStateType } from '../../../../types/action.common'
import { FolderAction } from '@web/lib/action'

interface AddFolderModalProp {
    close: (isEdit: boolean) => void,
    isOpen: boolean,
    targetFolderUid: string
}

interface AddFolderRequestState {
    state: CrepenActionStateType,
    message?: string
}

export const AddFolderModal = (prop: AddFolderModalProp) => {

    const [isEdit, setEditState] = useState<boolean>(false);
    const [requestState, setRequestState] = useState<AddFolderRequestState>()

    const folderTitleInputRef = useRef<HTMLInputElement>(null);


    const onModalCloseEventHandler = () => {
        prop.close(isEdit);
    }

    const addFolderAction = async () => {

        setRequestState({
            state: 'running',
            message: undefined
        })

        const formData = new FormData();
        formData.set('folder-title', folderTitleInputRef.current?.value ?? '');
        formData.set('parent-folder-uid', prop.targetFolderUid);

        try {
            const result = await FolderAction.addFolder(undefined, formData);

            if (result.success === true) {
                setRequestState({
                    state: 'complete'
                })

                alert('폴더가 생성되었습니다.');
                prop.close(true);
            }
            else {
                setRequestState({
                    state: 'error',
                    message: result.message
                })
            }
        }
        catch (e) {
            setRequestState({
                state: 'error',
                message: '서버와 연결이 원활하지 않습니다.'
            })
        }





    }


    useEffect(() => {
        folderTitleInputRef.current?.focus()
    }, [])

    return (
        <CrepenModal
            isOpen={prop.isOpen}
            close={onModalCloseEventHandler}
            className="cp-add-folder-modal"
            headerOptions={{
                title: 'Add Folder',
                enableCloseButton: false
            }}
            footerOptions={{
                enableCloseButton: true,
                enableSubmitButton: true,
                submit: addFolderAction,
                isLoadingSubmitButton: requestState?.state === 'running'
            }}
        >
            <span>Folder Name</span>
            <input className='cp-input-folder-name' type='text' placeholder='Input folder name' ref={folderTitleInputRef} />
            {
                requestState?.state === 'error' && !StringUtil.isEmpty(requestState?.message) &&
                <span className='cp-error-message'>{requestState.message}</span>
            }

        </CrepenModal>
    )
}