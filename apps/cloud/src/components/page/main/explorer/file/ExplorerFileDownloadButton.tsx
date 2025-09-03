'use client'

import { StringUtil } from "@web/lib/util/StringUtil"
import Link from "next/link"
import { FcDownload } from "react-icons/fc"

interface ExplorerFileDownloadButtonProp {
    downloadLink : string,
    isRunningCrypt : boolean
}

export const ExplorerFileDownloadButton = (prop : ExplorerFileDownloadButtonProp) => {
    return (
        <Link
            href={prop.downloadLink}
            download={true}
            className={
                StringUtil.joinClassName(
                    'cp-action-button',
                    prop.isRunningCrypt === true ? 'cp-disable' : ''
                )
            }
        >
            <div className='cp-button-icon'>
                <FcDownload fontSize={20} />
            </div>
            <div className='cp-button-text'>
                Download
            </div>
        </Link>
    )
}