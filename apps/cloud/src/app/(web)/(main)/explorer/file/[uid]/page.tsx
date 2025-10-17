
import '@web/assets/styles/page/main/explorer/file.explorer.page.scss'
import { CommonPage } from "@web/component/global/CommonPage"
import { GroupBox } from "@web/component/global/control/group-box/GroupBox";
import { ExplorerFileCryptButton } from '@web/component/page/main/explorer/file/ExplorerFileCryptButton';
import { ExplorerFileDownloadButton } from '@web/component/page/main/explorer/file/ExplorerFileDownloadButton';
import { ExplorerFileReloadButton } from '@web/component/page/main/explorer/file/ExplorerFileReloadButton';
import { ExplorerFileShareBox } from '@web/component/page/main/explorer/file/ExplorerFileShareBox';
import { LocaleConfig } from '@web/lib/config/LocaleConfig';
import { RestExplorerDataService } from '@web/lib/module/api-module/RestExplorerDataService';
import { AuthProvider } from '@web/lib/module/auth/AuthProvider';
import { BasePathInitializer } from '@web/lib/module/basepath/BasePathInitializer';
import { ServerLocaleInitializer } from '@web/lib/module/locale/ServerLocaleInitializer';
import { StringUtil } from '@web/lib/util/StringUtil';
import { cookies, headers } from 'next/headers';
import { Fragment } from 'react';
import { FcDownload, FcFile, FcFullTrash, FcHighPriority, FcLock, FcRefresh, FcUnlock } from 'react-icons/fc';
import urlJoin from 'url-join';

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

    const basePath = await BasePathInitializer.get({
        readHeader: await headers()
    })

    const fileData = await RestExplorerDataService
        .current(session?.token, locale ?? LocaleConfig.defaultLocale)
        .getFileInfo(fileUid);


    const isPreviewMime = (mime?: string) => {

        let isPreview = false;

        if (StringUtil.isEmpty(mime)) {
            return false;
        }

        const previewMimeList = [
            '^image\/.*$',
            '^video\/.*$'
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
                            (isPreviewMime(fileData.data?.fileMimeType) && !fileData.data?.cryptQueueList.find(x => x.queueState === 'running' || x.queueState === 'wait'))
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
                                (fileData.data?.encryptedFiles ?? []).length > 0 &&
                                <div className='cp-preview-encrypt-warning'>
                                    <FcHighPriority size={30} />
                                    <span>
                                        If your file is encrypted, loading speed will be significantly reduced. If you plan to distribute the file, please decrypt it.
                                    </span>
                                </div>
                            }
                            {
                                (
                                    isNaN(Number(fileData.data?.fileSize))
                                        ? 0
                                        : Number(fileData.data?.fileSize)
                                ) > 1024 * 1024 * 1024 * 1 * 1000000000
                                    ? <div className='cp-preview-deny'>
                                        <FcHighPriority size={30} />
                                        <span>
                                            We cannot show you a preview because the file size exceeds 1GB.
                                        </span>
                                    </div>
                                    : /^image\/.*$/.test(fileData.data?.fileMimeType ?? '')
                                        // eslint-disable-next-line @next/next/no-img-element
                                        ? <img
                                            className='cp-preview-obj'
                                            src={urlJoin(basePath ?? '/', '/api/file/download', `${fileData.data?.fileName ?? 'NFD'}`)}
                                            crossOrigin="anonymous"
                                            alt="Preview Image"
                                        />
                                        : /^video\/.*$/.test(fileData.data?.fileMimeType ?? '')
                                            ? <video controls
                                                className='cp-preview-obj'
                                                crossOrigin='anonymous'
                                                playsInline
                                            >
                                                <source
                                                    src={urlJoin(basePath ?? '/', '/api/file/download', `${fileData.data?.fileName ?? 'NFD'}`)}
                                                    type={fileData.data?.fileMimeType}
                                                />
                                            </video>
                                            : <Fragment />

                            }
                        </GroupBox.Content>
                    </GroupBox>
                    <div className='cp-file-side'>
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
                                            Create date
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
                                    <li className='cp-info-item'>
                                        <div className='cp-info-title'>
                                            File Encrypt State
                                        </div>
                                        <div className='cp-info-value'>
                                            {
                                                (fileData.data?.cryptQueueList ?? []).find(x => x.queueState === 'running' || x.queueState === 'wait')
                                                    ? 'Running Crypting'
                                                    : (fileData.data?.encryptedFiles ?? []).length > 0
                                                        ? 'ENCRYPT'
                                                        : 'DECRYPT'
                                            }
                                        </div>
                                    </li>
                                    <li className='cp-info-item'>
                                        <div className='cp-info-title'>
                                            Published
                                        </div>
                                        <div className='cp-info-value'>
                                            {
                                                fileData.data?.isPublished === true
                                                    ? 'Published'
                                                    : 'Not published'
                                            }
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
                                    <ExplorerFileDownloadButton
                                        downloadLink={
                                            urlJoin(
                                                basePath ?? '/',
                                                '/api/file/download',
                                                `${fileData.data?.fileName ?? 'NFD'}`
                                            )
                                        }
                                        isRunningCrypt={!!(fileData.data?.cryptQueueList ?? []).find(x => x.queueState === 'running' || x.queueState === 'wait')}
                                    />
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
                                    {
                                        fileData.data &&
                                        <ExplorerFileCryptButton
                                            isFileEncrypt={(fileData.data?.encryptedFiles ?? []).length > 0}
                                            fileUid={fileData.data.uid}
                                            isRunningCrypt={!!fileData.data.cryptQueueList.find(x => x.queueState === 'running' || x.queueState === 'wait')}
                                        />
                                    }

                                    <ExplorerFileReloadButton />
                                </div>

                                <ExplorerFileShareBox
                                    fileUid={fileUid ?? 'NFD'}
                                    defaultPublishedLink='1'
                                    defaultPublishedState={fileData.data?.isPublished ?? false}
                                    fileName={fileData.data?.fileName ?? 'NFD'}
                                />
                            </GroupBox.Content>
                        </GroupBox>
                    </div>

                    {/* <GroupBox
                        className='cp-file-monitor'
                        templete
                    >
                        <GroupBox.Header>

                        </GroupBox.Header>
                        <GroupBox.Content>

                        </GroupBox.Content>
                    </GroupBox> */}
                </CommonPage.Content>
            </CommonPage.Wrapper>

        </CommonPage>
    )
}


export default MainExplorerFilePage;