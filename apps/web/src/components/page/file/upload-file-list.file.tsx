import { faFolder } from "@fortawesome/free-regular-svg-icons"
import { faRefresh, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useGlobalBasePath } from "@web/component/config/GlobalBasePathProvider"
import { StringUtil } from "@web/lib/util/string.util"
import { UploadFileItemObject, UploadStateType, useUploadFileState } from "@web/modules/client/state/file.state"
import { useGlobalLanguage } from "@web/modules/client/state/global.state"
import { CrepenBaseError } from "@web/modules/common-1/error/CrepenBaseError"
import { CrepenComponentError } from "@web/modules/common-1/error/CrepenComponentError"
import { Ref, useEffect, useImperativeHandle, useState } from "react"

interface UploadFileListProp {
    className?: string,
    ref?: Ref<UploadFileListRef>,
    onChange?: (items: UploadFileItemObject[]) => void
}

export interface UploadFileListRef {
    appendFiles: (files: File[]) => void,
    getUploadedFiles: () => UploadFileItemObject[],
    isAllComplete: () => boolean,
    filterState: (...types: UploadStateType[]) => UploadFileItemObject[],
    reset: () => void
}

export const UploadFileList = (prop: UploadFileListProp) => {

    const fileStore = useUploadFileState();


    useImperativeHandle(prop.ref, () => ({
        appendFiles: (files: File[]) => {
            fileStore.appendFiles(files);
        },
        getUploadedFiles: () => {
            return fileStore.value.filter(x => x.uploadServerUid !== undefined)
        },
        isAllComplete: () => {
            return fileStore.value.filter(x => x.state !== 'complete').length === 0
        },
        filterState: (...types: UploadStateType[]) => {
            return fileStore.value.filter(x => types.indexOf(x.state) > -1)
        },
        reset: () => {
            fileStore.reset();
        }
    }))


    const onRemoveItem = (uid: string) => {
        fileStore.deleteItem(uid);
    }

    const onUpdateItem = (uid: string, updateItem: UploadFileItemObject) => {
        fileStore.updateItem(uid, updateItem);
    }


    // useEffect(() => {
    //     fileStore.reset();
    // }, [])

    useEffect(() => {
        if (prop.onChange) prop.onChange(fileStore.value ?? [])
    }, [fileStore.value])

    return (
        <div className={StringUtil.joinClassName(prop.className)}>
            {
                (fileStore.value ?? [])
                    .sort((x, y) => {
                        if ((x.state === 'error' ? -1 : 1) === (y.state === 'error' ? -1 : 1)) {
                            return (x.timestamp - y.timestamp) > 0 ? 1 : -1;
                        }
                        else {
                            return (x.state === 'error' ? -1 : 1) - (y.state === 'error' ? -1 : 1)
                        }
                    })
                    .filter(item => item !== undefined).map((item, idx) => (
                        <UploadFileItem
                            key={idx}
                            item={item}
                            onRemove={onRemoveItem}
                            onUpdateItem={onUpdateItem}
                        />
                    ))
            }
        </div>
    )
}

interface UploadFileItemProp {
    item: UploadFileItemObject,
    onRemove: (uid: string) => void,
    onUpdateItem: (uid: string, updateItem: UploadFileItemObject) => void
}


export const UploadFileItem = (prop: UploadFileItemProp) => {

    const basePath = useGlobalBasePath();
    const language = useGlobalLanguage();
    const [abortController, setAbortController] = useState<AbortController>(new AbortController());

    const uploadFile = async () => {



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


            const uploadFileRequest = await fetch(basePath.join('/api/file'), {
                method: 'PUT',
                body: formData,
                signal: abortController.signal,
                headers: {
                    'Accept-Language': language.value
                },
            } as any)



            const data = await uploadFileRequest.json();


            if (data.success === true) {
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
            else {
                throw new CrepenComponentError(data.message ?? "UNKNOWN EXCEPTION" , 500)
            }
        }
        catch (e) {
            let message = 'UNKNOWN EXCEPTION'
            if (e instanceof CrepenBaseError) {
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
        <div className="cp-file-item">
            <FontAwesomeIcon icon={faFolder} className="cp-file-icon" />
            <div className="cp-file-info">
                <span className="cp-file-name">{prop.item.file.name}</span>
                <div className="cp-file-progress" data-state={prop.item.state}>
                    <div className="cp-progress-bar"></div>
                </div>
                <div className="cp-error-message">{prop.item.message}</div>
                
            </div>

            <div className="cp-file-action">
                {
                    (prop.item.state === 'error' && (prop.item.disableRetry ?? false) === false) &&
                    <FontAwesomeIcon
                        icon={faRefresh}
                        className="cp-file-retry-bt cp-file-action-icon"
                        onClick={() => uploadFile()}
                    />
                }

                <FontAwesomeIcon
                    icon={faTrash}
                    className="cp-file-remove-bt cp-file-action-icon"
                    onClick={() => prop.onRemove(prop.item.uid)}
                />
            </div>


        </div>
    )
}