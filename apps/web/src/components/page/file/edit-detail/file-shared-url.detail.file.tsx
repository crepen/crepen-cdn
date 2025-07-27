'use client'

import './file-shared-url.detail.file.scss'
import { CrepenDetailItem } from "../../common/detail-list/detail-item.common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { useEffect, useState } from 'react';
import { useGlobalBasePath } from '@web/component/config/GlobalBasePathProvider';

interface FileSharedUrlDetailItemProp {
    title: string,
    fileUid?: string
}

export const FileSharedUrlDetailItem = (prop: FileSharedUrlDetailItemProp) => {

    const basePath = useGlobalBasePath();
    const [fileUrl, setFileUrl] = useState<string>()

    useEffect(() => {
        setFileUrl(`${window.location.origin}${basePath.basePath}/api/file/${prop.fileUid}/download/shared`);
    }, [])


    return (
        <CrepenDetailItem
            title={prop.title}
            className="cp-file-shared-url-detail-item"
        >
            <div className="cp-shared-url-box">
                {/* <Link href={fileUrl ?? '#'} className='cp-shared-link' target='_blank'>
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} className='cp-shared-link-icon' />
                    <span>{fileUrl}</span>
                    
                </Link> */}

                {/* <CrepenIconButton 
                    icon={faCopy}
                    className="cp-shared-copy-bt"
                    enableTooltip
                    tooltipText='copy'
                /> */}
                <FontAwesomeIcon
                    icon={faCopy}
                    className="cp-shared-copy-bt"
                    onClick={() => {
                        if (fileUrl) {
                            navigator.clipboard
                                .writeText(fileUrl)
                                .then(res => {
                                    alert('복사 완료')
                                })
                                .catch(err => {
                                    alert('복사할 수 없습니다.')
                                })
                        }

                    }}
                />
            </div>

        </CrepenDetailItem>
    )
}