import '@web/assets/style/main/page/file/file.page.main.scss'

import { faFile, faFileAudio, faFileZipper, faImage } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MimeUtil } from "@web/lib/util/mime.util";
import { redirect } from "next/navigation";
import { faCloudDownload, faDownload, faVideo } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { CrepenHttpService } from '@web/services/common/http.service';
import { GroupExpandBox } from '@web/components/page/common/group-box/group-box.common';
import Link from 'next/link';
import Image from 'next/image';
import { CrepenIconButton } from '@web/components/control/icon-button/icon-button.control';
import { RemoveFileIconButton } from '@web/components/page/file/button/remove-bt/remove-bt.file';
import { CrepenDetailItem } from '@web/components/page/common/detail-list/detail-item.common';
import { StringUtil } from '@web/lib/util/string.util';
import { FileTitleEditDetailItem } from '@web/components/page/file/edit-detail/file-title.edit-detail.file';
import { FileSharedEditDetailItem } from '@web/components/page/file/edit-detail/file-shared.edit-detail.file';
import { ClientDateLocaleWrap } from '@web/components/page/common/date-locale.wrap.common';
import { CrepenLanguageService } from '@web/services/common/language.service';
import { FileSharedUrlDetailItem } from '@web/components/page/file/edit-detail/file-shared-url.detail.file';
import { FileRemoveEditDetailItem } from '@web/components/page/file/edit-detail/file-remove.edit-detail.file';
import { CrepenFileOperationService } from '@web/modules/crepen/explorer/file/CrepenFileOperationService';
import urlJoin from 'url-join';

interface ExplorerFileInfoRoutePageProp {
    params: Promise<{
        uid?: string
    }>
}

export const ExplorerFileInfoRoutePage = async (prop: ExplorerFileInfoRoutePageProp) => {

    const targetFileUid = (await prop.params).uid;

    console.log('WW',targetFileUid);
    const fileData = await CrepenFileOperationService.getFiledata(targetFileUid ?? 'ntf');

    console.log('WW',fileData);

    if (fileData.success !== true) {
        redirect('/error')
    }   

    const fileCategory = MimeUtil.getCategory(fileData.data?.fileStore?.fileType ?? '');
    const locale = await CrepenLanguageService.getSessionLocale();

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
    const fileUrl = urlJoin(basePath ?? '/' ,  downloadUrl , );

     console.log('WW',fileUrl);

    return (
        <div className="cp-common-page cp-file-info-page">
            <div className="cp-page-header">
                <span className='cp-page-title'>
                    <FontAwesomeIcon icon={getFileCategoryIcon()} className='cp-file-icon' />
                    {decodeURIComponent(fileData.data?.fileTitle ?? '')}
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
                {
                    (fileCategory === 'image' || fileCategory === 'video') &&
                    <GroupExpandBox
                        title='미리보기'
                        className='cp-preview-box'
                        defaultOpen
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
                }

                <GroupExpandBox
                    title='정보'
                    defaultOpen
                >
                    <FileTitleEditDetailItem
                        title='File title'
                        value={decodeURIComponent(fileData.data?.fileTitle ?? '')}
                        fileUid={fileData.data?.uid}
                    />
                    <CrepenDetailItem
                        title='TYPE'
                    >
                        {fileData.data?.fileStore?.fileType}
                    </CrepenDetailItem>
                    <CrepenDetailItem
                        title='CATEGORY'
                    >
                        {fileCategory}
                    </CrepenDetailItem>
                    <CrepenDetailItem
                        title='SIZE'
                    >
                        {StringUtil.convertFormatByte(fileData.data?.fileStore?.fileSize ?? 0)}
                    </CrepenDetailItem>
                    <CrepenDetailItem
                        title='LAST UPDATE DATE'
                    >
                        {
                            fileData.data?.updateDate !== undefined
                                ? <ClientDateLocaleWrap
                                    date={fileData.data?.updateDate}
                                    locale={locale.data ?? 'en'}
                                />
                                : '-'
                        }

                    </CrepenDetailItem>
                      <CrepenDetailItem
                        title='TOTAL TRAFFIC SIZE'
                    >
                        {StringUtil.convertFormatByte(fileData.data?.trafficSize ?? 0)}
                    </CrepenDetailItem>
                </GroupExpandBox>
                <GroupExpandBox
                    title='Action'
                    defaultOpen
                >
                    <CrepenDetailItem
                        title='DOWNLOAD'
                    >
                        <Link href={downloadUrl} download>
                            <FontAwesomeIcon
                                icon={faCloudDownload} 
                                />
                        </Link>
                    </CrepenDetailItem>
                    <FileSharedEditDetailItem
                        title='SHARED'
                        value={fileData.data?.isPublished}
                        fileUid={fileData.data?.uid}
                    />
                    {
                        fileData.data?.isPublished &&
                        <FileSharedUrlDetailItem
                            title='Copy Publish URL'
                            fileUid={fileData.data.uid}
                        />
                    }
                    <FileRemoveEditDetailItem 
                         title='Remove File'
                         fileUid={fileData.data?.uid}
                         parentFolderUid={fileData.data?.parentFolderUid}
                    />
                </GroupExpandBox>
            </div>
        </div>
    )
}


export default ExplorerFileInfoRoutePage;