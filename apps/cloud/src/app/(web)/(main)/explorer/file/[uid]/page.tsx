
import '@web/assets/styles/page/main/explorer/file.explorer.page.scss'
import { CommonPage } from "@web/component/global/CommonPage"
import { GroupBox } from "@web/component/global/control/group-box/GroupBox";
import { ExplorerFileShareBox } from '@web/component/page/main/explorer/file/ExplorerFileShareBox';
import { StringUtil } from '@web/lib/util/StringUtil';
import { FcDownload, FcFile, FcFullTrash } from 'react-icons/fc';

interface MainExplorerFilePageProp {
    params: Promise<{
        uid: string
    }>
}

const MainExplorerFilePage = async (prop: MainExplorerFilePageProp) => {

    const params = await prop.params;
    const fileUid = params?.uid;

    return (
        <CommonPage
            className="cp-explorer-file-page"
        >
            <CommonPage.Wrapper
                size="m"
                template
            >
                <CommonPage.Content>
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
                                File Name
                            </div>
                            <div className='cp-preview-file-desc'>
                                File Desc
                            </div>
                        </GroupBox.Header>
                        <GroupBox.Content>

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
                                        File Name
                                    </div>
                                    <div className='cp-info-value'>
                                        Test.txt
                                    </div>
                                </li>
                                <li className='cp-info-item'>
                                    <div className='cp-info-title'>
                                        Size
                                    </div>
                                    <div className='cp-info-value'>
                                        {StringUtil.convertFormatByte(10000)}
                                    </div>
                                </li>
                                <li className='cp-info-item'>

                                </li>
                                <li className='cp-info-item'>

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
                                        <FcDownload fontSize={20}/>
                                    </div>
                                    <div className='cp-button-text'>
                                        Download
                                    </div>
                                </button>
                                <button
                                    className='cp-action-button'
                                >
                                    <div className='cp-button-icon'>
                                        <FcFullTrash fontSize={20}/>
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