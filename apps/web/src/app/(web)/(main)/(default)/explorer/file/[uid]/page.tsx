import '@web/assets/style/main/page/file/file.page.main.scss'

import { faFile, faFileAudio, faFileZipper, faImage } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MimeUtil } from "@web/lib/util/mime.util";
import { CrepenFileOperationService } from "@web/services/operation/file.operation.service";
import { redirect } from "next/navigation";
import { faDownload, faVideo } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { CrepenHttpService } from '@web/services/common/http.service';
import { GroupExpandBox } from '@web/components/page/common/group-box/group-box.common';
import Link from 'next/link';
import Image from 'next/image';
import { CrepenIconButton } from '@web/components/control/icon-button/icon-button.control';
import { RemoveFileIconButton } from '@web/components/page/file/button/remove-bt/remove-bt.file';

interface ExplorerFileInfoRoutePageProp {
    params: Promise<{
        uid?: string
    }>
}

export const ExplorerFileInfoRoutePage = async (prop: ExplorerFileInfoRoutePageProp) => {

    const targetFileUid = (await prop.params).uid;

    const fileData = await CrepenFileOperationService.getFiledata(targetFileUid ?? 'ntf');

    if (fileData.success !== true) {
        redirect('/error')
    }

    const fileCategory = MimeUtil.getCategory(fileData.data?.fileStore?.fileType ?? '');

    const getFileCategoryIcon = () => {
        let icon: IconProp = faFile;
        switch (fileCategory) {
            case 'image': icon = faImage; break;
            case 'audio': icon = faFileAudio; break;
            case 'zip': icon = faFileZipper; break;
            case 'video': icon = faVideo; break;
            default: icon = faFile; break;
        }

        return icon;
    }

    const basePath = await CrepenHttpService.getBasePath();
    const downloadUrl = `/api/file/${fileData.data?.uid ?? 'ntf'}/download`
    const fileUrl = `${basePath}${downloadUrl}`;

    return (
        <div className="cp-common-page cp-file-info-page">
            <div className="cp-page-header">
                <span className='cp-page-title'>
                    <FontAwesomeIcon icon={getFileCategoryIcon()} className='cp-file-icon' />
                    {fileData.data?.fileTitle}
                </span>

            </div>

            <div className="cp-page-content" data-type-category={fileCategory}>
                <GroupExpandBox
                    hideTitle
                    className='cp-action-box'
                    contentBoxClassName='cp-action-content-box'
                >
                    <RemoveFileIconButton
                        parentFolderUid={fileData.data?.parentFolderUid}
                        fileUid={fileData.data?.uid}
                    />
                    <CrepenIconButton
                        icon={faDownload}
                        enableTooltip
                        tooltipText='Download file.'
                    />

                </GroupExpandBox>
                <GroupExpandBox
                    title='미리보기'
                    className='cp-preview-box'
                >
                    {
                        fileCategory === 'image' &&
                        <Image
                            src={fileUrl}
                            alt=''
                            fill
                        />
                    }
                    {
                        fileCategory === 'video' &&
                        <video
                            src={fileUrl}
                            controls
                        />
                    }
                </GroupExpandBox>
                <GroupExpandBox
                    title='정보'
                    defaultOpen
                >
                    TYPE : {fileData.data?.fileStore?.fileType} <br />
                    CATEGORY : {fileCategory}
                </GroupExpandBox>
                <GroupExpandBox
                    title='Action'
                    defaultOpen
                >
                    Download : <Link href={downloadUrl} download>Download ITem</Link>
                </GroupExpandBox>
            </div>
        </div>
    )
}


export default ExplorerFileInfoRoutePage;