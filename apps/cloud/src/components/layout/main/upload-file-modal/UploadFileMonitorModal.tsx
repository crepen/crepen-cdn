import { GroupBox } from "@web/component/global/control/group-box/GroupBox";
import { useClientLocale } from "@web/lib/module/locale/ClientLocaleProvider";
import { useMainUploadFile } from "../provider/MainUploadFileProvider";
import { UploadFileMonitorItem } from "./UploadFileMonitorItem";
import { StringUtil } from "@web/lib/util/StringUtil";
import { useEffect, useState } from "react";
import { useFileUploadMutation } from "./useFileUploadMutation";
import { useUploadFileModal } from "../provider/MainUploadFileModalProvider";

interface UploadFileMonitorModalProp {

}

const abortControllers = new Map<string, AbortController>();

export const UploadFileMonitorModal = (prop: UploadFileMonitorModalProp) => {

    const uploadModalHook = useUploadFileModal();

    const localeHook = useClientLocale();
    const uploadFileHook = useMainUploadFile();
    const { mutate } = useFileUploadMutation();
    const [isUploading, setUploadState] = useState<boolean>(false);


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
                }
            });
        }
    }, [uploadFileHook])


    return (
        <div className={StringUtil.joinClassName('cp-upload-file-monitor', uploadModalHook.isOpen ? 'active' : '')}>
            <div className="cp-monitor-box">
                <GroupBox className="cp-monitor-item">
                    TYest
                </GroupBox>
                <GroupBox className="cp-monitor-item">
                    TYest
                </GroupBox>
                <GroupBox className="cp-monitor-item">
                    <div className="cp-item-header">
                        {localeHook.translate('layout.main.filemonitor.list.header.title')}
                    </div>
                    <div className="cp-item-content">
                        <div className="cp-upload-file-list">
                            {
                                uploadFileHook.files.length > 0
                                    ? uploadFileHook.files
                                        .sort((x, y) => y.timestamp - x.timestamp)
                                        .map((item, idx) => (
                                            <UploadFileMonitorItem
                                                key={idx}
                                                item={item}
                                                uuid={item.uuid}
                                                state={item.uploadState}
                                                onChangeState={(uuid, state, message) => {
                                                    uploadFileHook.updateState(uuid, state, message);
                                                }}
                                                abort={() => {

                                                    const abortControl = abortControllers.get(item.uuid);
                                                    abortControl?.abort();
                                                }}
                                            />
                                        ))
                                    : (
                                        <div className="cp-no-data">
                                            {localeHook.translate('common.system.NO_DATA')}
                                        </div>
                                    )
                            }

                        </div>
                    </div>
                </GroupBox>

            </div>
        </div>
    )
}

