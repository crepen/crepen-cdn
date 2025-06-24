import { ChangeEvent, Fragment, useEffect, useRef, useState } from 'react';
import './fast-add-button.file.scss';
import { UploadFileItemObject, useUploadFileState } from '@web/lib/state/file.state';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faFolder } from '@fortawesome/free-regular-svg-icons';
import { StringUtil } from '@web/lib/util/string.util';
import { useGlobalBasePath, useGlobalLanguage } from '@web/lib/state/global.state';
import { CrepenCommonError } from '@web/lib/common/common-error';
import { faRefresh, faTrash } from '@fortawesome/free-solid-svg-icons';
import { CrepenModal } from '../../common/base-modal.common';

interface FastAddFileModalProp {
    folderUid: string,
    open: boolean,
    close: (isEdit: boolean) => void
}

export const FastAddFileModal = (prop: FastAddFileModalProp) => {

    const uploadInputRef = useRef<HTMLInputElement>(null);

    const uploadList = useUploadFileState();

    const [isEdit, setEditState] = useState<boolean>(false);





    //#region Event Handler

    const modalCloseEventHandler = () => {
        uploadList.reset();
        prop.close(isEdit)
    }

    const fileInputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {

        if (!isEdit && (e.currentTarget.files ?? []).length > 0) {
            setEditState(true);
        }

        uploadList.appendFiles(Array.from(e.currentTarget.files ?? []));
        e.target.value = '';
    }

    const onRemoveItem = (uid: string) => {
        uploadList.deleteItem(uid);
    }

    const onUpdateItem = (uid: string, updateItem: UploadFileItemObject) => {
        uploadList.updateItem(uid, updateItem);
    }

    //#endregion

    return (
        <CrepenModal
            className='cp-fast-add-file-modal'
            close={modalCloseEventHandler}
            isOpen={prop.open}
            headerOptions={{
                title : 'Add Files',
                enableCloseButton : false
            }}
            footerOptions={{
                enableCloseButton : true,
                enableSubmitButton : false
            }}
        >
            <button className='cp-upload-bt' onClick={() => uploadInputRef.current?.click()}>UPLOAD</button>

            <div className='cp-upload-list'>
                {
                    uploadList.value
                        .sort((x, y) => {
                            if ((x.state === 'error' ? -1 : 1) === (y.state === 'error' ? -1 : 1)) {
                                return (x.timestamp - y.timestamp) > 0 ? 1 : -1;
                            }
                            else {
                                return (x.state === 'error' ? -1 : 1) - (y.state === 'error' ? -1 : 1)
                            }
                        })
                        .filter(item => item !== undefined)
                        .map((item, idx) => (
                            <FastAddFileItem
                                key={idx}
                                folderUid={prop.folderUid}
                                item={item}
                                onRemove={onRemoveItem}
                                onUpdateItem={onUpdateItem}
                            />
                        ))
                }
            </div>

            <input type='file' multiple className='cp-file-input' ref={uploadInputRef} onChange={fileInputChangeHandler}></input>
        </CrepenModal>
    )
}

interface FastAddFileItemProp {
    item: UploadFileItemObject,
    folderUid: string,
    onRemove: (uid: string) => void,
    onUpdateItem: (uid: string, updateItem: UploadFileItemObject) => void
}

const FastAddFileItem = (prop: FastAddFileItemProp) => {

    const basePath = useGlobalBasePath();
    const language = useGlobalLanguage();

    const [abortController, setAbortController] = useState<AbortController>(new AbortController());

    const uploadFile = async () => {

        console.log("UPLOAD FILE")

        prop.onUpdateItem(prop.item.uid, {
            state: 'running',
            disableRetry: undefined,
            file: prop.item.file,
            uid: prop.item.uid,
            message: undefined,
            timestamp: prop.item.timestamp
        })

        try {



            if (prop.item.file.size > 100 * 1024 * 1024) {
                prop.onUpdateItem(prop.item.uid, {
                    file: prop.item.file,
                    uid: prop.item.uid,
                    state: 'error',
                    disableRetry: true,
                    message: 'File size overflow (Limit 100MB)',
                    timestamp: prop.item.timestamp
                })
                return;
            }


            if (abortController.signal.aborted === true) {
                setAbortController(new AbortController());
            }
            const formData = new FormData();
            formData.set('file', prop.item.file);

            const uploadFileRequest = await fetch(`${basePath.value}/api/file`, {
                method: 'PUT',
                body: formData,
                signal: abortController.signal,
                headers: {
                    'Accept-Language': language.value
                },
            })

            const data = await uploadFileRequest.json();

            if (data.success !== true) {
                throw new CrepenCommonError(data.message ?? "UNKNOWN EXCEPTION")
            }



            // RELATION FILE - FILE GROUP
            const bodyData = {
                fileUid: data.uid,
                folderUid: prop.folderUid,
                fileTitle: prop.item.file.name
            }

            const relFileRequest = await fetch(`${basePath.value}/api/file/rel`, {
                method: 'POST',
                body: JSON.stringify(bodyData),
                signal: abortController.signal,
                headers: {
                    'Accept-Language': language.value
                },
            })

            const dataResult = await relFileRequest.json();

            if (dataResult.success !== true) {
                throw new CrepenCommonError(dataResult.message ?? "UNKNOWN EXCEPTION")
            }



            prop.onUpdateItem(prop.item.uid, {
                file: prop.item.file,
                uid: prop.item.uid,
                state: 'complete',
                disableRetry: true,
                message: undefined,
                timestamp: prop.item.timestamp,
                uploadServerUid: data.uid
            })


        }
        catch (e) {
            let message = 'UNKNOWN EXCEPTION'
            if (e instanceof CrepenCommonError) {
                message = e.message ?? message;
            }

            prop.onUpdateItem(prop.item.uid, {
                file: prop.item.file,
                uid: prop.item.uid,
                state: 'error',
                disableRetry: false,
                message: message,
                timestamp: prop.item.timestamp
            })

        }

    }

    useEffect(() => {
        if (prop.item.state === 'waiting') {
            uploadFile();
        }

        return (() => {
            if (abortController.signal.aborted === false) {
                abortController.abort();
            }
        })
    }, [])
    return (
        <div className='cp-upload-file-item' data-state={prop.item.state}>
            <div className='cp-item-icon'>
                <FontAwesomeIcon icon={faFile} className='cp-icon' />
            </div>

            <div className='cp-item-content'>
                <span className='cp-file-name'>
                    {prop.item.file.name}
                </span>
                <div className='cp-progress-box'>
                    <div className='cp-progress-bar'></div>
                </div>
                {
                    !StringUtil.isEmpty(prop.item.message) &&
                    <span className='cp-message'>
                        {prop.item.message}
                    </span>
                }

            </div>
            <div className='cp-item-action' aria-disabled={prop.item.state !== 'error'}>
                <FontAwesomeIcon icon={faRefresh} className='cp-action-bt' onClick={() => uploadFile()} />
                <FontAwesomeIcon icon={faTrash} className='cp-action-bt' onClick={() => prop.onRemove(prop.item.uid)} />
            </div>

        </div>
    )
}