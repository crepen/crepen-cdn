import { GroupBox } from "@web/component/global/control/group-box/GroupBox";
import { useClientLocale } from "@web/lib/module/locale/ClientLocaleProvider";
import { useMainUploadFile } from "../provider/MainUploadFileProvider";
import { FileTypeIcon, UploadFileMonitorItem } from "./UploadFileMonitorItem";
import { StringUtil } from "@web/lib/util/StringUtil";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFileUploadMutation } from "./useFileUploadMutation";
import { useUploadFileModal } from "../provider/MainUploadFileModalProvider";
import { FaStop } from "react-icons/fa6";
import { UploadMonitorIconButton } from "./control/UploadMonitorIconButton";
import { UploadMonitorItemList } from "./control/UploadMonitorItemList";
import { useRouter } from "next/navigation";

interface UploadFileMonitorModalProp {

}

const abortControllers = new Map<string, AbortController>();

export const UploadFileMonitorModal = (prop: UploadFileMonitorModalProp) => {

    const uploadModalHook = useUploadFileModal();

    const localeHook = useClientLocale();
    const uploadFileHook = useMainUploadFile();
    const { mutate } = useFileUploadMutation();
    const [isUploading, setUploadState] = useState<boolean>(false);
    const progressBarRef = useRef<HTMLDivElement>(null);
    const route = useRouter();

    useMemo(() => {
        progressBarRef?.current?.style.setProperty('--progress-value', uploadFileHook.progress.data.progress.toString())
    }, [uploadFileHook.progress.data])


    useEffect(() => {
        const nextFileToUpload = uploadFileHook.files.find(item => item.uploadState === 'WAIT');

        // 현재 업로드 중인 파일이 없고, 대기 중인 파일이 있을 경우
        if (!isUploading && nextFileToUpload) {
            setUploadState(true);
            const controller = new AbortController();
            abortControllers.set(nextFileToUpload.uuid, controller);

            mutate({ fileItem: nextFileToUpload, signal: controller.signal }, {
                onSettled: () => {
                    // 업로드 성공/실패와 관계없이 다음 파일을 위해 isUploading 상태를 false로 설정
                    setUploadState(false);
                    abortControllers.delete(nextFileToUpload.uuid);
                    route.refresh();
                }
            });
        }
    }, [uploadFileHook])


    useEffect(() => {
        return (() => {
            abortControllers.forEach(control => {
                if (control.signal.aborted) {
                    control.abort();
                }
            })
        })
    }, [])


    return (
        <div className={StringUtil.joinClassName('cp-upload-file-monitor', uploadModalHook.isOpen ? 'active' : '')}>
            <div className="cp-monitor-box">
                <GroupBox className="cp-monitor-item cp-monitor-header-group">
                    <div className="cp-item-header">
                        {localeHook.translate('layout.main.filemonitor.list.header.title')}
                    </div>
                    <div className="cp-item-content">

                    </div>
                </GroupBox>
                <GroupBox className="cp-monitor-item cp-upload-progress-monitor"
                    hidden={!uploadFileHook.files.find(x => x.uploadState === 'UPLOADING')}
                >
                    <div className="cp-uploading-monitor-box">
                        <div className="cp-header">
                            <h3>Upload File</h3>
                        </div>
                        <div className="cp-item-info">
                            <div className="cp-item-icon">
                                <FileTypeIcon
                                    type={uploadFileHook.files.find(x => x.uploadState === 'UPLOADING')?.file.type}
                                    size={30}
                                />
                            </div>
                            <div className="cp-item-title">
                                <span>
                                    {uploadFileHook.files.find(x => x.uploadState === 'UPLOADING')?.file.name}
                                </span>
                            </div>
                            <div className="cp-item-desc">
                                {uploadFileHook.files.find(x => x.uploadState === 'UPLOADING')?.file.type}
                            </div>
                            <div className="cp-item-action">
                                <UploadMonitorIconButton
                                    className="cp-upload-stop-bt"
                                    icon={<FaStop size={16} />}
                                    onClick={() => {
                                        const uploadItem = uploadFileHook.files.find(x => x.uploadState === 'UPLOADING')
                                        if (uploadItem) {
                                            const abortControl = abortControllers.get(uploadItem.uuid)
                                            abortControl?.abort();
                                        }

                                    }}
                                />
                            </div>
                        </div>

                        <div className="cp-item-progress-text">
                            <div className="cp-progress-percent">
                                <span>{uploadFileHook.progress.data.progress.toFixed(1)}% </span>
                            </div>
                            <div className="cp-progress-unit">
                                <span>(</span>
                                <span>{StringUtil.convertFormatByte(uploadFileHook.progress.data.uploadSize)}</span>
                                <span>/</span>
                                <span>{StringUtil.convertFormatByte(uploadFileHook.progress.data.total)}</span>
                                <span>)</span>
                            </div>

                        </div>

                        <div className="cp-item-progress">
                            <div className="cp-progress-bar" ref={progressBarRef} />
                        </div>
                    </div>
                </GroupBox>
             

                                    
                <UploadMonitorItemList
                    type={['WAIT']}
                    className="cp-wait-list"
                    itemList={uploadFileHook.files}
                    abort={(uuid: string) => {
                        const abortControl = abortControllers.get(uuid);
                        abortControl?.abort();
                    }}
                    onChangeState={uploadFileHook.updateState}
                    title={localeHook.translate('layout.main.filemonitor.list.wait-list.header-title')}
                />
                <UploadMonitorItemList
                    type={['ERROR', "CANCELLED"]}
                    className="cp-failed-list"
                    itemList={uploadFileHook.files}
                    abort={(uuid: string) => {
                        const abortControl = abortControllers.get(uuid);
                        abortControl?.abort();
                    }}
                    onChangeState={uploadFileHook.updateState}
                    title={localeHook.translate('layout.main.filemonitor.list.failed-list.header-title')}
                />
                <UploadMonitorItemList
                    type={['COMPLETE']}
                    className="cp-complete-list"
                    itemList={uploadFileHook.files}
                    abort={(uuid: string) => {
                        const abortControl = abortControllers.get(uuid);
                        abortControl?.abort();
                    }}
                    onChangeState={uploadFileHook.updateState}
                    title={localeHook.translate('layout.main.filemonitor.list.complete-list.header-title')}
                />
            </div>
        </div>
    )
}

