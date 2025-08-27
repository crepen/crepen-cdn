'use server'

import '@web/assets/styles/page/main/dashboard/dashboard.main.page.scss';
import { CommonPage } from '@web/component/global/CommonPage';

import { GroupBox } from '@web/component/global/control/group-box/GroupBox';
import { LocaleConfig } from '@web/lib/config/LocaleConfig';
import { ServerLocaleProvider } from '@web/lib/module/locale/ServerLocaleProvider';
import { Metadata } from 'next';
import Link from 'next/link';
import { FcAudioFile, FcExternal, FcFile, FcImageFile, FcInternal, FcOpenedFolder, FcShare, FcVideoFile } from 'react-icons/fc';


export const generateMetadata = async (): Promise<Metadata> => {
    const localeProv = ServerLocaleProvider.current(LocaleConfig);

    return {
        title: await localeProv.translate('title.dashboard')
    }
}


const MainDashboardPage = async () => {

    const localeProv = ServerLocaleProvider.current(LocaleConfig);



    return (
        <CommonPage
            className='cp-dashboard-page'
        >
            <CommonPage.Wrapper>
                <GroupBox className='cp-dashboard-widget'>
                    <div className='cp-widget-header'>
                        <div className='cp-header-sub-title'>
                            {localeProv.translate('page.main.dashboard.widget.items.totaluploadfile')}
                        </div>
                        <div className='cp-header-icon'>
                            <FcExternal />
                        </div>
                    </div>

                    <div className='cp-widget-content'>
                        <span className=' cp-widget-count'>
                            90
                            <span className='cp-widget-unit'>
                                {localeProv.translate('page.main.dashboard.widget.unit.item')}
                            </span>
                        </span>

                    </div>
                </GroupBox>
                <GroupBox className='cp-dashboard-widget'>
                    <div className='cp-widget-header'>
                        <div className='cp-header-sub-title'>
                            {localeProv.translate('page.main.dashboard.widget.items.publishedfile')}
                        </div>
                        <div className='cp-header-icon'>
                            <FcShare />
                        </div>
                    </div>

                    <div className='cp-widget-content'>
                        <span className=' cp-widget-count'>
                            90
                            <span className='cp-widget-unit'>
                                {localeProv.translate('page.main.dashboard.widget.unit.item')}
                            </span>
                        </span>
                    </div>

                </GroupBox>
                <GroupBox className='cp-dashboard-widget'>
                    <div className='cp-widget-header'>
                        <div className="cp-header-sub-title">
                            {localeProv.translate('page.main.dashboard.widget.items.folder')}
                        </div>
                        <div className='cp-header-icon'>
                            <FcOpenedFolder />
                        </div>
                    </div>

                    <div className='cp-widget-content'>
                        <span className=' cp-widget-count'>
                            90
                            <span className='cp-widget-unit'>
                                {localeProv.translate('page.main.dashboard.widget.unit.item')}
                            </span>
                        </span>
                    </div>
                </GroupBox>
                <GroupBox className='cp-dashboard-widget'>
                    <div className='cp-widget-header'>
                        <div className="cp-header-sub-title">
                            {localeProv.translate('page.main.dashboard.widget.items.downloadrequestcount')}
                        </div>
                        <div className='cp-header-icon'>
                            <FcInternal />
                        </div>
                    </div>

                    <div className='cp-widget-content'>
                        <span className=' cp-widget-count'>
                            90
                            <span className='cp-widget-unit'>
                                {localeProv.translate('page.main.dashboard.widget.unit.request')}
                            </span>
                        </span>
                    </div>
                </GroupBox>
                <GroupBox className='cp-dashboard-widget cp-split-2'>
                    <div className='cp-widget-header'>
                        <div className="cp-header-title">
                            {localeProv.translate('page.main.dashboard.widget.items.recentfile')}
                        </div>

                        <Link href={'/explorer/folder'} className='cp-widget-link'>
                            {localeProv.translate('page.main.dashboard.widget.common.showall')}
                        </Link>
                    </div>

                    <div className='cp-widget-content cp-widget-list'>
                        <div className='cp-grid-item cp-card'>
                            <div className='cp-card-title'>
                                File1.txt
                            </div>
                            <div className='cp-card-description'>
                                2024.01.01
                            </div>
                        </div>
                        <div className='cp-grid-item cp-card'>
                            <div className='cp-card-title'>
                                File1.txt
                            </div>
                            <div className='cp-card-description'>
                                2024.01.01
                            </div>
                        </div>
                        <div className='cp-grid-item cp-card'>
                            <div className='cp-card-title'>
                                File1.txt
                            </div>
                            <div className='cp-card-description'>
                                2024.01.01
                            </div>
                        </div>
                        <div className='cp-grid-item cp-card'>
                            <div className='cp-card-title'>
                                File1.txt
                            </div>
                            <div className='cp-card-description'>
                                2024.01.01
                            </div>
                        </div>

                    </div>

                </GroupBox>
                <GroupBox className='cp-dashboard-widget cp-split-2'>
                    <div className='cp-widget-header'>
                        <div className="cp-header-title">
                            {localeProv.translate('page.main.dashboard.widget.items.downloadrank')}
                        </div>
                        <Link href={'/explorer/folder'} className='cp-widget-link'>
                            {localeProv.translate('page.main.dashboard.widget.common.showall')}
                        </Link>
                    </div>

                    <div className='cp-widget-content cp-widget-list'>
                        <div className='cp-grid-item cp-card'>
                            <div className='cp-card-icon'>
                                <FcAudioFile />
                            </div>
                            <div className='cp-card-title'>
                                File1.txt
                            </div>
                            <div className='cp-card-description'>
                                2024.01.01
                            </div>
                        </div>
                        <div className='cp-grid-item cp-card'>
                            <div className='cp-card-icon'>
                                <FcFile />
                            </div>
                            <div className='cp-card-title'>
                                File1.txt
                            </div>
                            <div className='cp-card-description'>
                                2024.01.01
                            </div>
                        </div>
                        <div className='cp-grid-item cp-card'>
                            <div className='cp-card-icon'>
                                <FcVideoFile />
                            </div>
                            <div className='cp-card-title'>
                                File1.txt
                            </div>
                            <div className='cp-card-description'>
                                2024.01.01
                            </div>
                        </div>
                        <div className='cp-grid-item cp-card'>
                            <div className='cp-card-icon'>
                                <FcImageFile />
                            </div>
                            <div className='cp-card-title'>
                                File1.txt
                            </div>
                            <div className='cp-card-description'>
                                2024.01.01
                            </div>
                        </div>
                    </div>

                </GroupBox>

                <GroupBox className='cp-dashboard-widget cp-split-2'>
                    <div className='cp-widget-header'>
                        <div className="cp-header-title">
                            {localeProv.translate('page.main.dashboard.widget.items.traffic')}
                        </div>
                        <Link href={'/explorer/folder'} className='cp-widget-link'>
                            {localeProv.translate('page.main.dashboard.widget.common.showall')}
                        </Link>
                    </div>

                </GroupBox>
            </CommonPage.Wrapper>

        </CommonPage>
    )
}

export default MainDashboardPage;