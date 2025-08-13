import '@web/assets/styles/page/main/explorer/explorer.page.scss'
import { GroupBox } from '@web/component/global/control/group-box/GroupBox';
import { ExplorerToolbar } from '@web/component/page/main/explorer/header/toolbar/ExplorerToolbar';
import { HistoryBackButton } from '@web/component/page/main/explorer/header/top/HistoryBackButton';
import { LocaleConfig } from '@web/lib/config/LocaleConfig';
import { ServerLocaleProvider } from '@web/lib/module/locale/ServerLocaleProvider';
import { FcExternal, FcOpenedFolder } from 'react-icons/fc';

interface MainExplorerDefaultPageProp {
    searchParams?: Promise<{
        sortType?: string,
        sortCategory?: string
    }>
}

const MainExplorerDefaultPage = async (prop: MainExplorerDefaultPageProp) => {

    const localeProv = ServerLocaleProvider.current(LocaleConfig);
    const searchParam = await prop.searchParams;



    return (
        <div className='cp-explorer-page cp-page cp-fixed-page'>
            <div className='cp-page-header'>
                <div className='cp-top-header'>
                    <div className='cp-flex-left'>
                        <HistoryBackButton className='cp-back-bt' />
                    </div>
                    <div className='cp-flex-right'>
                        <button className='cp-header-bt cp-new-folder-bt'>
                            <div className='cp-button-icon'>
                                <FcOpenedFolder />
                            </div>
                            <div className='cp-button-text'>
                                {localeProv.translate('page.main.explorer.header.button.newfolder')}
                            </div>
                        </button>
                        <button className='cp-header-bt cp-upload-file-bt'>
                            <div className='cp-button-icon'>
                                <FcExternal />
                            </div>
                            <div className='cp-button-text'>
                                {localeProv.translate('page.main.explorer.header.button.uploadfile')}
                            </div>
                        </button>
                    </div>

                </div>
                <ExplorerToolbar
                    sortOptions={{
                        defaultSortType : searchParam?.sortType,
                        defaultSortCategory : searchParam?.sortCategory
                    }}
                />
            </div>
            <div className='cp-page-content'>
                <GroupBox className='cp-file-list-box'>
                    gwege
                </GroupBox>
            </div>
        </div>
    )
}

export default MainExplorerDefaultPage;