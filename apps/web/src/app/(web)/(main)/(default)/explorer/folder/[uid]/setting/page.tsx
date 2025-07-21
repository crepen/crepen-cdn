import { faFolder } from '@fortawesome/free-regular-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '@web/assets/style/main/page/folder/setting.folder.page.main.scss'
import { ClientDateLocaleWrap } from '@web/components/page/common/date-locale.wrap.common';
import { DetailItem } from '@web/components/page/folder/detail-item/detail-item.setting.folder';
import { EditDetialItem } from '@web/components/page/folder/detail-item/edit.detail-item.setting.folder';
import { EditFolderNameDetailItem } from '@web/components/page/folder/detail-item/folder-name.edit.detail-item.setting.folder';
import { StringUtil } from '@web/lib/util/string.util';
import { CrepenLanguageService } from '@web/services/common/language.service';

import { CrepenFolderOperationService } from "../../../../../../../../modules/crepen/explorer/folder/CrepenFolderOperationService";
import Link from 'next/link';
import { PropsWithChildren } from 'react';

interface ExplorerFolderSettingRoutePageProp {
    params: Promise<{
        uid?: string
    }>
}

export const ExplorerFolderSettingRoutePage = async (prop: ExplorerFolderSettingRoutePageProp) => {

    const targetFolderUid = (await prop.params).uid;
    const folderData = await CrepenFolderOperationService.getFolderData(targetFolderUid, true);

    const locale = await CrepenLanguageService.getSessionLocale();
    console.log('LOCALE', locale);


    const getTotalFileSize = () => {
        const fileSizeList = (folderData.data?.files ?? []).map(x => x.fileStore?.fileSize);

        if (fileSizeList.length === 0) {
            return 0
        }
        else {
            return fileSizeList.reduce((acc, element) => (acc ?? 0) + (element ?? 0)) ?? 0
        }
    }






    return (
        <div className="cp-common-page cp-folder-setting-page">
            <div className="cp-page-header">
                <div className="cp-header-title">
                    <FontAwesomeIcon icon={faFolder} className='cp-header-icon' />
                    <strong>{folderData.data?.folderTitle}</strong>

                </div>
            </div>
            <div className="cp-page-content">
                <div className='cp-content-box'>
                    {
                        folderData.data?.parentFolder
                            ?
                            <EditFolderNameDetailItem
                                title='Folder Name'
                                value={folderData.data?.folderTitle}
                                folderUid={folderData.data?.uid}
                            />
                            :
                            <DetailItem
                                title='Folder Name'
                            >
                                {folderData.data?.folderTitle}
                            </DetailItem>
                    }

                    <DetailItem title='Folder Create Date'>
                        <span>
                            <ClientDateLocaleWrap
                                date={folderData.data?.createDate ?? new Date()}
                                locale={locale.data ?? 'en'}
                            />
                        </span>

                    </DetailItem>

                    <DetailItem title='Folder Update Date'>
                        <span>
                            <ClientDateLocaleWrap
                                date={folderData.data?.updateDate ?? new Date()}
                                locale={locale.data ?? 'en'}
                            />
                        </span>

                    </DetailItem>
                </div>
                <div className='cp-content-box'>
                    <DetailItem title='Total file size'>
                        {StringUtil.convertFormatByte(getTotalFileSize())}
                    </DetailItem>
                    <DetailItem title='Request Count'>
                        {0}
                    </DetailItem>
                    <DetailItem title='Child Folder Count'>
                        {folderData.data?.childFolder?.length ?? 0}
                    </DetailItem>
                    <DetailItem title='Child File Count'>
                        {folderData.data?.files?.length ?? 0}
                    </DetailItem>

                    <DetailItem title='Last Upload File Date'>
                        {
                            (folderData.data?.files ?? []).length > 0
                                ?
                                <ClientDateLocaleWrap
                                    date={

                                        (folderData.data?.files ?? [])
                                            .map(x => x.updateDate)
                                            .sort((x, y) => x > y ? -1 : 1)[0] ?? new Date()
                                    }
                                    locale={locale.data ?? 'en'}
                                />
                                : '-'
                        }


                    </DetailItem>

                </div>
                <div className='cp-content-box'>
                    <DetailItem title='Go to explorer'>
                        <Link href={`/explorer/folder/${folderData.data?.uid}`}>
                            <button>Go to explorer</button>
                        </Link>
                    </DetailItem>
                    {
                        folderData.data?.parentFolder &&
                        <DetailItem title='Delete Folder'>
                            <button>Remove Folder</button>
                        </DetailItem>
                    }

                </div>
                {/* Create Data : {folderData.data?.createDate} */}
            </div>
        </div>
    )
}

export default ExplorerFolderSettingRoutePage



