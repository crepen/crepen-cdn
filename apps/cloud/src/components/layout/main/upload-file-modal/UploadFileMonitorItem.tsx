import { StringUtil } from "@web/lib/util/StringUtil";
import { useRef, Fragment, useMemo } from "react";
import { FcImageFile, FcFile } from "react-icons/fc";
import { useMainUploadFile } from "../provider/MainUploadFileProvider";
import { UploadFileState, UploadFileObject } from "@web/lib/types/entity/ClientUploadFile";
import { TbReload } from "react-icons/tb";
import { FaStop } from "react-icons/fa6";
import { CgPlayListRemove } from "react-icons/cg";

interface UploadFileMonitorItemProp {
    item: UploadFileObject,
    uuid: string,
    state: UploadFileState,
    onChangeState?: (uuid: string, state: UploadFileState, message?: string) => void,
    abort?: () => void
}



export const UploadFileMonitorItem = (prop: UploadFileMonitorItemProp) => {
    const uploadQueueHook = useMainUploadFile();

    const getMimeCategory = (mime?: string): 'image' | 'video' | 'file' => {

        const imageRegex = /^image\/(jpeg|png|gif|webp|svg\+xml|bmp|tiff|apng)$/g

        if (StringUtil.isEmpty(mime)) {
            return 'file'
        }
        else if (imageRegex.test(mime!)) {
            return 'image'
        }
        else {
            return 'file'
        }

    }


    return (
        <div

            className="cp-file-item"
            data-state={prop.item.uploadState}
        >
            <div className="cp-item-icon">
                <FileTypeIcon type={prop.item.file.type} />
            </div>
            <div className="cp-item-title">
                {prop.item.file.name}
            </div>
            <div className="cp-item-desc">
                <span>{StringUtil.convertFormatByte(prop.item.file.size, 1)}</span>
                <span>·</span>
                <span>{getMimeCategory(prop.item.file.type)}</span>
            </div>
            <div className="cp-item-error-message">
                {prop.item.errorMessage}
            </div>
            <div className="cp-item-state">
                <div className="cp-item-state-clip">
                    {prop.item.uploadState}
                </div>
            </div>
            <div className="cp-item-action">


                {
                    prop.item.uploadState === 'UPLOADING' &&
                    <button className="cp-monitor-item-control cp-action-icon-bt cp-cancled-bt"
                        onClick={() => {
                            if(prop.abort) prop.abort();
                        }}
                    >
                        <FaStop size={20} />
                    </button>
                }


                {
                    (prop.item.uploadState === 'ERROR' ||
                        prop.item.uploadState === 'CANCELLED') &&
                    <button className="cp-monitor-item-control cp-action-icon-bt cp-retry-bt"
                        onClick={() => {
                            if(prop.onChangeState) prop.onChangeState(prop.item.uuid, 'WAIT')
                        }}
                    >
                        <TbReload size={25} />
                    </button>
                }


                {
                    (prop.item.uploadState !== 'UPLOADING') &&
                    <button className="cp-monitor-item-control cp-action-icon-bt cp-delete-bt"
                        onClick={() => {
                            uploadQueueHook.removeQueue(prop.item.uuid);
                        }}
                    >
                        <CgPlayListRemove size={25} />
                    </button>
                }


            </div>
        </div>
    )
}


export const FileTypeIcon = (prop: { type?: string, size?: number }) => {
    const getMimeCategory = (mime?: string): 'image' | 'video' | 'file' => {

        const imageRegex = /^image\/(jpeg|png|gif|webp|svg\+xml|bmp|tiff|apng)$/g

        if (StringUtil.isEmpty(mime)) {
            return 'file'
        }
        else if (imageRegex.test(mime!)) {
            return 'image'
        }
        else {
            return 'file'
        }

    }

    return getMimeCategory(prop.type) === 'image'
        ? <FcImageFile size={prop.size} />
        : getMimeCategory(prop.type) === 'file'
            ? <FcFile size={prop.size} />
            : <FcFile size={prop.size} />
}