'use client'

import './FolderLinearItem.scss'

import { faCheckCircle, faFile, faFileVideo, faFileZipper, faFolder, faImage } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheckCircle as faCheckCircleSolid, faGlobeAsia } from '@fortawesome/free-solid-svg-icons'
import { MimeUtil } from '@web/lib/util/mime.util'
import { StringUtil } from '@web/lib/util/string.util'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface FolderLinearItemProp {
    type: 'folder' | 'file',
    title: string,
    uid: string,
    fileType?: string,
    size?: number,
    isSelected?: boolean,
    disableSelect? : boolean,
    isFileShared? : boolean,
    onSelectChange? : (isSelect : boolean) => void
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
        title : prop.title
    }

    useEffect(() => {
        // console.log("FILE_SIZE", prop.size)
    }, [])

    return (
        <div
            className="cp-folder-item cp-item-linear"
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
                if(prop.onSelectChange) prop.onSelectChange(!(prop.isSelected ?? false));
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

            <div className='cp-item-title' {...divTitleAttribute}>{prop.title}</div>
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
        </div>
    )
}