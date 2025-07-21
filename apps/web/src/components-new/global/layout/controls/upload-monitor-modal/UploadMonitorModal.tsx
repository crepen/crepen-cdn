'use client'

import { useFileUploadState } from '@web/modules/common/state/useFileUploadState';
import { UploadMonitorItem } from './UploadMonitorItem'
import './UploadMonitorModal.scss'
import { CrepenUploadFile, CrepenUploadFileStateType } from '@web/modules/common/entity/CrepenUploadFile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useFileUploadMonitorVisible } from '@web/modules/common/state/useFileUploadMonitorVisible';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CrepenComponentError } from '@web/modules/common/error/CrepenComponentError';
import { CrepenBaseError } from '@web/modules/common/error/CrepenBaseError';
import { useGlobalBasePath, useGlobalLanguage } from '@web/lib/state/global.state';
import { Virtuoso } from 'react-virtuoso';
import urlJoin from 'url-join';

export const UploadMonitorModal = () => {

    const uploadHook = useFileUploadState();
    const monitorVisibleHook = useFileUploadMonitorVisible();

    const route = useRouter();
    const basePath = useGlobalBasePath();
    const language = useGlobalLanguage();

    const [isUploading, setUploadState] = useState<boolean>(false);

    const [itemFilterArray, setItemFilter] = useState<CrepenUploadFileStateType[]>([]);

    const uploadData = async (file: CrepenUploadFile) => {
        setUploadState(true);

        try {
            uploadHook.updateUploadState(file.uuid, 'running');

            if (file.abortControl.signal.aborted) file.abortControl = new AbortController();

            if (file.data.size > 100 * 1024 * 1024) {
                throw new CrepenComponentError('Maximum upload size exceeded (up to 100MB)', 400)
            }


            //#region UPLOAD FUNC

            const formData = new FormData();
            formData.set('file', file.data);
            formData.set('title' , file.data.name);
            formData.set('folderUid' , file.targetFolderUid);

            console.log(urlJoin(basePath.value , '/api/file'))

            const uploadFileRequest = await fetch(urlJoin(basePath.value , '/api/file'), {
                method: 'PUT',
                body: formData,
                signal: file.abortControl.signal,
                headers: {
                    'Accept-Language': language.value
                },
            })

            const data = await uploadFileRequest.json();


            if (data.success !== true) {
                throw new CrepenComponentError(data.message ?? "UNKNOWN EXCEPTION", data.statusCode ?? 500)
            }

            // RELATION FILE - FILE GROUP
            // const bodyData = {
            //     fileUid: data.uid,
            //     folderUid: file.targetFolderUid,
            //     fileTitle: file.data.name
            // }

            // const relFileRequest = await fetch(urlJoin(basePath.value , '/api/file/rel'), {
            //     method: 'POST',
            //     body: JSON.stringify(bodyData),
            //     signal: file.abortControl.signal,
            //     headers: {
            //         'Accept-Language': language.value
            //     },
            // })

            // const dataResult = await relFileRequest.json();

            // if (dataResult.success !== true) {
            //     throw new CrepenComponentError(dataResult.message ?? "UNKNOWN EXCEPTION", dataResult.statusCode ?? 500)
            // }

            //#endregion


            uploadHook.updateUploadState(file.uuid, 'upload');

            setUploadState(false);
        }
        catch (e) {
            let message = 'Unknown Error'
            if (e instanceof CrepenBaseError) {
                message = e.message;
            }
            else if ((e as Error).name === 'AbortError') {
                message = 'Abort Request'
            }

            uploadHook.updateUploadState(file.uuid, 'error', message);
            setUploadState(false);
        }




    }

    //#region  DATA_SORT
    const convertNumState = (state: CrepenUploadFileStateType) => {
        switch (state) {
            case 'error': return 2;
            case 'running': return 1;
            case 'upload': return 4;
            case 'wait': return 3;
            default: return 5;
        }
    }
    const dataSort = (x: CrepenUploadFile, y: CrepenUploadFile) => {

        if (convertNumState(x.uploadState) !== convertNumState(y.uploadState)) {
            return convertNumState(x.uploadState) > convertNumState(y.uploadState) ? 1 : -1
        }

        if (x.createDate !== y.createDate) {
            return x.createDate > y.createDate ? 1 : -1
        }

        if (x.data.name !== y.data.name) {
            return x.data.name > y.data.name ? 1 : -1
        }

        return 1;
    }


    //#endregion

    useEffect(() => {
        if (isUploading === false) {
            if (uploadHook.value.filter(x => x.uploadState === 'wait').length !== 0) {
                const uploadList = uploadHook.value
                    .filter(x => x.uploadState === 'wait')
                    .sort((x, y) => x.createDate > y.createDate ? 1 : -1);
                uploadData(uploadList[0]!);
            }
            else if (
                (
                    uploadHook.value.filter(x => x.uploadState === 'running').length +
                    uploadHook.value.filter(x => x.uploadState === 'wait').length
                ) === 0
            ) {
                console.log('REFRESH ROUTE');
                route.refresh();
            }

        }
    }, [uploadHook, isUploading])

    return (
        <div
            className="cp-upload-monitor-modal"
            data-visible={monitorVisibleHook.value ? 'visible' : 'hide'}
            
        >
            <div className='cp-modal-header'>
                <div className='cp-title'>
                    Upload File ({uploadHook.value.filter(x => x.uploadState === 'upload').length} / {uploadHook.value.length})
                </div>
                <div className='cp-action'>
                    <FontAwesomeIcon
                        className='cp-close-bt'
                        icon={faXmark}
                        onClick={() => {
                            monitorVisibleHook.changeState(false);
                        }}
                    />
                </div>
                <div className='cp-filter'>
                    <button
                        onClick={() => {
                            const stateType: CrepenUploadFileStateType = 'upload';
                            if (itemFilterArray.indexOf(stateType) > -1) {
                                setItemFilter(itemFilterArray.filter(x => x !== stateType))
                            }
                            else {
                                setItemFilter([
                                    ...itemFilterArray,
                                    stateType
                                ])
                            }
                        }}
                        data-selected={itemFilterArray.indexOf('upload') > -1}
                    >
                        COMPLETE
                    </button>
                    <button
                        onClick={() => {
                            const stateType: CrepenUploadFileStateType = 'error';
                            if (itemFilterArray.indexOf(stateType) > -1) {
                                setItemFilter(itemFilterArray.filter(x => x !== stateType))
                            }
                            else {
                                setItemFilter([
                                    ...itemFilterArray,
                                    stateType
                                ])
                            }
                        }}
                        data-selected={itemFilterArray.indexOf('error') > -1}
                    >
                        Error
                    </button>
                    <button
                        onClick={() => {
                            const stateType: CrepenUploadFileStateType = 'wait';
                            if (itemFilterArray.indexOf(stateType) > -1) {
                                setItemFilter(itemFilterArray.filter(x => x !== stateType))
                            }
                            else {
                                setItemFilter([
                                    ...itemFilterArray,
                                    stateType
                                ])
                            }
                        }}
                        data-selected={itemFilterArray.indexOf('wait') > -1}
                    >
                        Wait
                    </button>
                    <button
                        onClick={() => {
                            const stateType: CrepenUploadFileStateType = 'running';
                            if (itemFilterArray.indexOf(stateType) > -1) {
                                setItemFilter(itemFilterArray.filter(x => x !== stateType))
                            }
                            else {
                                setItemFilter([
                                    ...itemFilterArray,
                                    stateType
                                ])
                            }
                        }}
                        data-selected={itemFilterArray.indexOf('running') > -1}
                    >
                        RUNNING
                    </button>
                </div>
            </div>
            <div className='cp-modal-content'>
                {
                    uploadHook.value
                        .filter(x => itemFilterArray.length === 0 ? true : itemFilterArray.indexOf(x.uploadState) > -1)
                        .length === 0 &&
                    <div className='cp-no-data'>
                        NO DATA
                    </div>
                }

                <Virtuoso
                    classID='cp-upload-list-box'
                    totalCount={
                        uploadHook.value
                            .filter(
                                x => {
                                    if (itemFilterArray.length === 0) {
                                        return true;
                                    }
                                    else {
                                        return itemFilterArray.indexOf(x.uploadState) > -1
                                    }
                                }
                            )
                            .length
                    }
                    itemContent={(idx) => {
                        const data = uploadHook.value
                            .filter(
                                x => {
                                    if (itemFilterArray.length === 0) {
                                        return true;
                                    }
                                    else {
                                        return itemFilterArray.indexOf(x.uploadState) > -1
                                    }
                                }
                            )
                            .sort(dataSort)[idx] as CrepenUploadFile;
                        return (
                            <UploadMonitorItem
                                key={idx}
                                fileData={data}
                                hidden={
                                    itemFilterArray.length === 0
                                        ? false
                                        : !(itemFilterArray.indexOf(data.uploadState) > -1)
                                }
                            />
                        )
                    }}
                />

                {/* {
                    uploadHook.value
                        // .filter(x => itemFilterArray.length === 0 ? true : itemFilterArray.indexOf(x.uploadState) > -1)
                        .sort(dataSort)
                        .map((file: CrepenUploadFile, idx: number) => (
                            <UploadMonitorItem
                                key={idx}
                                fileData={file}
                                hidden={
                                    itemFilterArray.length === 0
                                        ? false
                                        : !(itemFilterArray.indexOf(file.uploadState) > -1)
                                }
                            />
                        ))
                } */}
            </div>
            <div className='cp-modal-footer'>
                <button
                    onClick={() => {
                        uploadHook.removeSpecificStateItems('upload');
                    }}
                    disabled={uploadHook.value.filter(x => x.uploadState === 'upload').length === 0}
                >
                    완료된 항목 삭제
                </button>
                <button
                    onClick={() => {
                        uploadHook.removeSpecificStateItems('error');
                    }}
                    disabled={uploadHook.value.filter(x => x.uploadState === 'error').length === 0}
                >
                    오류 항목 삭제
                </button>
                <button
                    onClick={() => {
                        uploadHook.value.filter(x => x.uploadState === 'running' || x.uploadState === 'wait').forEach((value: CrepenUploadFile) => {
                            if (value.abortControl.signal.aborted !== true) {
                                value.abortControl.abort();
                            }

                            uploadHook.updateUploadState(value.uuid, 'error', 'Cancled');
                        });
                        setUploadState(false);
                        // route.refresh();
                    }}
                    disabled={uploadHook.value.filter(x => x.uploadState === 'running' || x.uploadState === 'wait').length === 0}
                >
                    전체 취소
                </button>
            </div>
        </div>
    )
}