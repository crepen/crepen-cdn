
import '@web/assets/styles/page/main/explorer/file.explorer.page.scss'
import { CommonPage } from "@web/component/global/CommonPage"
import { GroupBox } from "@web/component/global/control/group-box/GroupBox";
import { ExplorerFileShareBox } from '@web/component/page/main/explorer/file/ExplorerFileShareBox';
import { LocaleConfig } from '@web/lib/config/LocaleConfig';
import { RestExplorerDataService } from '@web/lib/module/api-module/RestExplorerDataService';
import { AuthProvider } from '@web/lib/module/auth/AuthProvider';
import { ServerLocaleInitializer } from '@web/lib/module/locale/ServerLocaleInitializer';
import { StringUtil } from '@web/lib/util/StringUtil';
import { cookies } from 'next/headers';
import { Fragment } from 'react';
import { FcDownload, FcFile, FcFullTrash } from 'react-icons/fc';

interface MainExplorerFilePageProp {
    params: Promise<{
        uid: string
    }>
}

const MainExplorerFilePage = async (prop: MainExplorerFilePageProp) => {

    const params = await prop.params;
    const fileUid = params?.uid;

    const session = await AuthProvider.current().getSession();
    const locale = await ServerLocaleInitializer.current(LocaleConfig).get({ readCookie: await cookies() });

    const fileData = await RestExplorerDataService
        .current(session?.token, locale ?? LocaleConfig.defaultLocale)
        .getFileInfo(fileUid);


    const isPreviewMime = (mime?: string) => {

        let isPreview = false;

        if (StringUtil.isEmpty(mime)) {
            return false;
        }

        const previewMimeList = [
            '^image\/.*$'
        ]

        for (const regex of previewMimeList) {
            const reg = new RegExp(regex)
            if (reg.test(mime!)) {
                isPreview = true
            }

            if (isPreview === true) {
                break;
            }
        }

        return isPreview;
    }


    return (
        <CommonPage
            className="cp-explorer-file-page"
        >
            <CommonPage.Wrapper
                size="m"
                template
            >
                <CommonPage.Content
                    className={
                        StringUtil.joinClassName(
                            isPreviewMime(fileData.data?.fileMimeType)
                                ? 'cp-active-preview'
                                : ''
                        )
                    }
                >
                    <GroupBox
                        className='cp-file-preview'
                        templete
                    >
                        <GroupBox.Header
                            className='cp-preview-header'
                        >
                            <div className='cp-preview-icon'>
                                <div className='cp-file-icon-box'>
                                    <FcFile size={28} />
                                </div>
                            </div>
                            <div className='cp-preview-file-name'>
                                {fileData.data?.title}
                            </div>
                            <div className='cp-preview-file-desc'>
                                File Desc
                            </div>
                        </GroupBox.Header>
                        <GroupBox.Content
                            className='cp-preview-content'
                        >
                            {
                                /^image\/.*$/.test(fileData.data?.fileMimeType ?? '')
                                    // eslint-disable-next-line @next/next/no-img-element
                                    ? <img
                                        className='cp-preview-image'
                                        src={`http://localhost:13332/explorer/file/download/publish/${fileData.data?.fileName}`}
                                        crossOrigin="anonymous"
                                        alt="Example Image"
                                    />
                                    : <Fragment />
                            }
                        </GroupBox.Content>
                    </GroupBox>
                    <GroupBox
                        className='cp-file-info'
                        templete
                    >
                        <GroupBox.Header>
                            <div className='cp-box-title'>
                                File Info
                            </div>
                        </GroupBox.Header>
                        <GroupBox.Content>
                            <ul className='cp-info-list'>
                                <li className='cp-info-item'>
                                    <div className='cp-info-title'>
                                        Title
                                    </div>
                                    <div className='cp-info-value'>
                                        {fileData.data?.title}
                                    </div>
                                </li>
                                <li className='cp-info-item'>
                                    <div className='cp-info-title'>
                                        File Name
                                    </div>
                                    <div className='cp-info-value'>
                                        {fileData.data?.fileName}
                                    </div>
                                </li>
                                <li className='cp-info-item'>
                                    <div className='cp-info-title'>
                                        Type
                                    </div>
                                    <div className='cp-info-value'>
                                        {fileData.data?.fileMimeType}
                                    </div>
                                </li>
                                <li className='cp-info-item'>
                                    <div className='cp-info-title'>
                                        Size
                                    </div>
                                    <div className='cp-info-value'>
                                        {StringUtil.convertFormatByte(
                                            isNaN(Number(fileData.data?.fileSize))
                                                ? 0
                                                : Number(fileData.data?.fileSize)
                                        )}
                                    </div>
                                </li>
                                <li className='cp-info-item'>
                                    <div className='cp-info-title'>
                                        Upload date
                                    </div>
                                    <div className='cp-info-value'>
                                        {fileData.data?.createDate}
                                    </div>
                                </li>
                                <li className='cp-info-item'>
                                    <div className='cp-info-title'>
                                        Update date
                                    </div>
                                    <div className='cp-info-value'>
                                        {fileData.data?.updateDate}
                                    </div>
                                </li>
                            </ul>
                        </GroupBox.Content>
                    </GroupBox>
                    <GroupBox
                        className='cp-file-action'
                        templete
                    >
                        <GroupBox.Header>
                            <div className='cp-box-title'>
                                Action
                            </div>
                        </GroupBox.Header>
                        <GroupBox.Content>
                            <div className='cp-group-action'>
                                <button
                                    className='cp-action-button'
                                >
                                    <div className='cp-button-icon'>
                                        <FcDownload fontSize={20} />
                                    </div>
                                    <div className='cp-button-text'>
                                        Download
                                    </div>
                                </button>
                                <button
                                    className='cp-action-button'
                                >
                                    <div className='cp-button-icon'>
                                        <FcFullTrash fontSize={20} />
                                    </div>
                                    <div className='cp-button-text'>
                                        Remove
                                    </div>
                                </button>
                                <button
                                    className='cp-action-button'
                                >
                                    <div className='cp-button-icon'>
                                        <FcDownload fontSize={20} />
                                    </div>
                                    <div className='cp-button-text'>
                                        Download
                                    </div>
                                </button>
                                <button
                                    className='cp-action-button'
                                >
                                    <div className='cp-button-icon'>
                                        <FcDownload fontSize={20} />
                                    </div>
                                    <div className='cp-button-text'>
                                        Download
                                    </div>
                                </button>
                            </div>
                            <ExplorerFileShareBox
                                fileUid={fileUid ?? 'NFD'}
                                defaultPublishedLink='1'
                                defaultPublishedState={true}
                            />
                        </GroupBox.Content>
                    </GroupBox>
                    <GroupBox
                        className='cp-file-monitor'
                        templete
                    >
                        <GroupBox.Header>

                        </GroupBox.Header>
                        <GroupBox.Content>

                        </GroupBox.Content>
                    </GroupBox>
                </CommonPage.Content>
            </CommonPage.Wrapper>

        </CommonPage>
    )
}


export default MainExplorerFilePage;