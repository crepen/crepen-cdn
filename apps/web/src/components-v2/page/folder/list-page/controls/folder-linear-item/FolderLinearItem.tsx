'use client'

import './FolderLinearItem.scss'

import { faCheckCircle, faFile, faFileVideo, faFileZipper, faFolder, faImage } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheckCircle as faCheckCircleSolid, faCloudDownload, faCopy, faFileDownload, faGlobeAsia } from '@fortawesome/free-solid-svg-icons'
import { MimeUtil } from '@web/lib/util/mime.util'
import { StringUtil } from '@web/lib/util/string.util'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { useGlobalBasePath } from '@web/lib/state/global.state'
import urlJoin from 'url-join'

interface FolderLinearItemProp {
    type: 'folder' | 'file',
    title: string,
    uid: string,
    fileType?: string,
    size?: number,
    isSelected?: boolean,
    disableSelect?: boolean,
    isFileShared?: boolean,
    onSelectChange?: (isSelect: boolean) => void
}

export const FolderLinearItem = (prop: FolderLinearItemProp) => {

    const router = useRouter();

    const dataIcon = () => {

        const fileCategory = MimeUtil.getCategory(prop.fileType ?? '-');

        return prop.type === 'folder' ? faFolder
            : fileCategory === 'image'
                ? faImage
                : fileCategory === 'video'
                    ? faFileVideo
                    : fileCategory === 'zip'
                        ? faFileZipper
                        : faFile
    }

    const divTitleAttribute = {
        title: decodeURIComponent(prop.title)
    }

    useEffect(() => {
        // console.log("FILE_SIZE", prop.size)
    }, [])

    return (
        <div
            className={StringUtil.joinClassName("cp-folder-item cp-item-linear", prop.type === 'file' ? 'cp-item-file' : 'cp-item-folder')}
            data-selected={prop.disableSelect === true ? undefined : prop.isSelected}
            data-disabled-select={prop.disableSelect}
            onDoubleClick={() => {
                if (prop.type === 'file') {
                    router.push(`/explorer/file/${prop.uid}`);
                }
                else if (prop.type === 'folder') {
                    router.push(`/explorer/folder/${prop.uid}`)
                }
            }}
            onClick={() => {
                if (prop.onSelectChange) prop.onSelectChange(!(prop.isSelected ?? false));
            }}
        >
            <div className='cp-item-check-box'>
                <FontAwesomeIcon
                    icon={faCheckCircleSolid}
                />
            </div>
            <div className='cp-item-type-icon'>
                <FontAwesomeIcon
                    icon={dataIcon()}
                />
            </div>

            <div className='cp-item-title' {...divTitleAttribute}>{decodeURIComponent(prop.title)}</div>
            {
                (prop.type === 'file' && prop.isFileShared === true) &&
                <div className='cp-item-published'>
                    <FontAwesomeIcon
                        icon={faGlobeAsia}
                    />
                    <span>Published</span>
                </div>
            }
            {
                prop.type === 'file' &&
                <div className='cp-item-size'>{StringUtil.convertFormatByte(prop.size ?? 0)}</div>
            }
            {
                prop.type === 'file' &&
                <div className='cp-item-action'>
                    <LinearItemFileDownloadButton
                        fileUid={prop.uid}
                    />

                    {
                        prop.isFileShared === true &&
                        <LinearItemActionButton
                            fileUid={prop.uid}
                        />
                    }

                </div>

            }
        </div>
    )
}

export const LinearItemActionButton = (prop: { fileUid: string }) => {

    const basePath = useGlobalBasePath();

    const titleAttribute = {
        title: 'Copy Publish File URL'
    };


    return (
        <div
            className='cp-action-bt'
            onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();

                const fileUrl = urlJoin(location.origin, basePath.value, 'api/file', prop.fileUid, 'download');
                // window.navigator.clipboard.writeText(fileUrl);
                navigator.clipboard
                    .writeText(fileUrl)
                    .then(res => {
                        alert('복사 완료')
                    })
                    .catch(err => {
                        console.log(err);
                        alert('복사할 수 없습니다.')
                    })

                alert('copy url');
            }}
            onDoubleClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
            {...titleAttribute}
        >
            <FontAwesomeIcon
                icon={faCopy}
                className='cp-action-bt-icon'

            />
        </div>
    )
}



export const LinearItemFileDownloadButton = (prop: { fileUid: string }) => {
    const titleAttribute = {
        title: 'Download File'
    };

    return (
        <Link
            href={`/api/file/${prop.fileUid}/download`}
            className='cp-action-bt'
            download={true}
            onClick={(e) => {
                e.stopPropagation();
            }}
            onDoubleClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
            {...titleAttribute}
        >
            <FontAwesomeIcon
                icon={faCloudDownload}
                className='cp-action-bt-icon'


            />
        </Link>
    )
}