'use client'


import './UploadMonitorItem.scss'
import { useEffect, useRef } from 'react'
import { StringUtil } from '@web/lib/util/string.util'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faRefresh, faStopCircle, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useFileUploadState } from '@web/modules/common/state/useFileUploadState'
import { CrepenUploadFile } from '@web/modules/common/entity/CrepenUploadFile'
import { faFolder } from '@fortawesome/free-regular-svg-icons'

interface UploadMonitorItemProp {
    fileData: CrepenUploadFile,
    hidden? : boolean
}

export const UploadMonitorItem = (prop: UploadMonitorItemProp) => {

    const progressRef = useRef<HTMLDivElement>(null);

    const uploadHook = useFileUploadState();


    useEffect(() => {
        return (() => {
            if (prop.fileData.abortControl.signal.aborted !== true) {
                prop.fileData.abortControl.abort();
            }
        })
    }, [])

    return (
        <div 
        className="cp-upload-monitor-item"
            data-file-state={prop.fileData.uploadState}
            data-hidden={prop.hidden}
        >
            <div className='cp-file-info'>
                <div className='cp-file-name'>{prop.fileData.data.name}</div>
                <div className='cp-file-desc'>
                    <div className='cp-file-save-dir'>
                        <FontAwesomeIcon icon={faFolder} className='cp-file-dir-icon' />
                        {prop.fileData.targetFolderUid.folderTitle}
                    </div>
                    <div className='cp-file-size'>{StringUtil.convertFormatByte(prop.fileData.data.size)}</div>
                </div>

            </div>

            {
                prop.fileData.uploadState === 'running' &&
                <div
                    className='cp-upload-progress'
                    ref={progressRef}
                    data-mode={'loop'}
                >
                    <div className='cp-progress-bar' />
                </div>
            }
            {
                prop.fileData.uploadState === 'error' &&
                <div className='cp-progress-message'>
                    {prop.fileData.message}
                </div>
            }
            <div className='cp-file-action'>
                {
                    prop.fileData.uploadState === 'running' &&
                    <FontAwesomeIcon
                        icon={faStopCircle}
                        className='cp-stop-upload-bt cp-item-bt'
                        onClick={() => {
                            if (!prop.fileData.abortControl.signal.aborted) {
                                prop.fileData.abortControl.abort();
                            }
                        }}
                    />
                }
                {
                    prop.fileData.uploadState === 'upload' &&
                    <FontAwesomeIcon
                        icon={faCheckCircle}
                        className='cp-success-icon'
                    />
                }
                {
                    (prop.fileData.uploadState === 'error') &&
                    <FontAwesomeIcon
                        icon={faRefresh}
                        className='cp-retry-bt cp-item-bt'
                        onClick={() => {
                            // uploadFile()
                            uploadHook.updateUploadState(prop.fileData.uuid, 'wait');
                        }}
                    />
                }
                {
                    (prop.fileData.uploadState === 'upload' || prop.fileData.uploadState === 'error'|| prop.fileData.uploadState === 'wait') &&
                    <FontAwesomeIcon
                        icon={faTrash}
                        className='cp-remove-item-bt cp-item-bt'
                        onClick={() => {
                            uploadHook.removeItem(prop.fileData)
                        }}
                    />
                }
            </div>
        </div>
    )
}