import '@web/assets/style/main/page/file/file.page.main.scss'

import { faFile, faFileAudio, faFileZipper, faImage } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MimeUtil } from "@web/lib/util/mime.util";
import { faCloudDownload, faDownload, faVideo } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { GroupExpandBox } from '@web/components/page/common/group-box/group-box.common';
import Link from 'next/link';
import Image from 'next/image';
import { RemoveFileIconButton } from '@web/components/page/file/button/remove-bt/remove-bt.file';
import { CrepenDetailItem } from '@web/components/page/common/detail-list/detail-item.common';
import { StringUtil } from '@web/lib/util/string.util';
import { FileTitleEditDetailItem } from '@web/components/page/file/edit-detail/file-title.edit-detail.file';
import { FileSharedEditDetailItem } from '@web/components/page/file/edit-detail/file-shared.edit-detail.file';
import { FileSharedUrlDetailItem } from '@web/components/page/file/edit-detail/file-shared-url.detail.file';
import { FileRemoveEditDetailItem } from '@web/components/page/file/edit-detail/file-remove.edit-detail.file';
import urlJoin from 'url-join';
import { CustomEnvProvider } from '@web/modules/server/service/CustomEnvProvider';
import { ServerI18nProvider } from '@web/modules/server/i18n/ServerI18nProvider';
import { FileDataService } from '@web/modules/api/service/FileDataService';
import { DateUtil } from '@web/modules/util/DateUtil';
import { CrepenIconButton } from '@web/component/common/icon-button/icon-button.control';

interface ExplorerFileInfoRoutePageProp {
    params: Promise<{
        uid?: string
    }>
}

export const ExplorerFileInfoRoutePage = async (prop: ExplorerFileInfoRoutePageProp) => {

    const targetFileUid = (await prop.params).uid;

    // const fileData = await CrepenFileOperationService.getFiledata(targetFileUid ?? 'ntf');
    const fileData = await FileDataService.getFileData(targetFileUid);
    

    const fileCategory = MimeUtil.getCategory(fileData?.fileStore?.fileType ?? '');
    // const locale = await CrepenLanguageService.getSessionLocale();
    const locale = await ServerI18nProvider.getSystemLocale();

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

    const basePath = await CustomEnvProvider.getBasePath();
    const downloadUrl = `/api/file/${fileData?.uid ?? 'ntf'}/download`
    const fileUrl = urlJoin(basePath ?? '/' ,  downloadUrl , );

    return (
        <div className="cp-common-page cp-file-info-page">
            <div className="cp-page-header">
                <span className='cp-page-title'>
                    <FontAwesomeIcon icon={getFileCategoryIcon()} className='cp-file-icon' />
                    {decodeURIComponent(fileData?.fileTitle ?? '')}
                </span>

            </div>

            <div className="cp-page-content" data-type-category={fileCategory}>
                <GroupExpandBox
                    hideTitle
                    className='cp-action-box'
                    contentBoxClassName='cp-action-content-box'
                >
                    <RemoveFileIconButton
                        parentFolderUid={fileData?.parentFolderUid}
                        fileUid={fileData?.uid}
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
                        value={decodeURIComponent(fileData?.fileTitle ?? '')}
                        fileUid={fileData?.uid}
                    />
                    <CrepenDetailItem
                        title='TYPE'
                    >
                        {fileData?.fileStore?.fileType}
                    </CrepenDetailItem>
                    <CrepenDetailItem
                        title='CATEGORY'
                    >
                        {fileCategory}
                    </CrepenDetailItem>
                    <CrepenDetailItem
                        title='SIZE'
                    >
                        {StringUtil.convertFormatByte(fileData?.fileStore?.fileSize ?? 0)}
                    </CrepenDetailItem>
                    <CrepenDetailItem
                        title='LAST UPDATE DATE'
                    >
                        {
                            DateUtil.convertDateTimeZoneFromUTC(fileData?.updateDate , locale ?? ServerI18nProvider.getDefaultLanguage()) ?? '-'
                        }
                        {/* {
                            fileData?.updateDate !== undefined
                                ? <ClientDateLocaleWrap
                                    date={fileData?.updateDate}
                                    locale={locale ?? ServerI18nProvider.getDefaultLanguage()}
                                />
                                : '-'
                        } */}

                    </CrepenDetailItem>
                      <CrepenDetailItem
                        title='TOTAL TRAFFIC SIZE'
                    >
                        {StringUtil.convertFormatByte(fileData?.trafficSize ?? 0)}
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
                        value={fileData?.isPublished}
                        fileUid={fileData?.uid}
                    />
                    {
                        fileData?.isPublished &&
                        <FileSharedUrlDetailItem
                            title='Copy Publish URL'
                            fileUid={fileData.uid}
                        />
                    }
                    <FileRemoveEditDetailItem 
                         title='Remove File'
                         fileUid={fileData?.uid}
                         parentFolderUid={fileData?.parentFolderUid}
                    />
                </GroupExpandBox>
            </div>
        </div>
    )
}


export default ExplorerFileInfoRoutePage;