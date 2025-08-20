import '@web/assets/styles/page/main/explorer/explorer.page.scss'
import { CommonPage } from '@web/component/global/CommonPage';
import { GroupBox } from '@web/component/global/control/group-box/GroupBox';
import { ExplorerFileUploadButton } from '@web/component/page/main/explorer/ExplorerFileUploadButton';
import { ExplorerListLoading, ExplorerListTable } from '@web/component/page/main/explorer/ExplorerListTable';
import { ExplorerNewFolderButton } from '@web/component/page/main/explorer/header/toolbar/ExplorerNewFolderButton';
import { ExplorerToolbar } from '@web/component/page/main/explorer/header/toolbar/ExplorerToolbar';
import { HistoryBackButton } from '@web/component/page/main/explorer/header/top/HistoryBackButton';
import { ExplorerListValidateProvider } from '@web/component/page/main/explorer/provider/ExplorerListValidateProvider';
import { LocaleConfig } from '@web/lib/config/LocaleConfig';
import { CustomProcessError } from '@web/lib/error/CustomProcessError';
import { RestExplorerDataService } from '@web/lib/module/api-module/RestExplorerDataService';
import { AuthProvider } from '@web/lib/module/auth/AuthProvider';
import { ServerLocaleInitializer } from '@web/lib/module/locale/ServerLocaleInitializer';
import { ServerLocaleProvider } from '@web/lib/module/locale/ServerLocaleProvider';
import { RestListResult, RestSearchFilterOptions } from '@web/lib/types/api/dto/RestCommonDto';
import { ExplorerFilterData, ExplorerTreeEntity } from '@web/lib/types/api/dto/RestExplorerDto';
import { StringUtil } from '@web/lib/util/StringUtil';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Suspense } from 'react';
import { FcHighPriority, FcOpenedFolder } from 'react-icons/fc';

interface MainExplorerDefaultPageProp {
    uid?: string,
    searchParams?: Promise<{
        sortType?: string,
        sortCategory?: string,
        page?: string,
        pageSize?: string,
        keyword?: string
    }>,
    params?: Promise<{
        uid: string
    }>
}

const MainExplorerListPage = async (prop: MainExplorerDefaultPageProp) => {

    // #region PROCESS
    const localeProv = ServerLocaleProvider.current(LocaleConfig);
    const searchParam = await prop.searchParams;
    const params = await prop.params;

    const searchParamArray = Object.keys(searchParam ?? {})
        .map(key => (`${key}=${encodeURIComponent((searchParam as Record<string, string>)![key!] ?? '')}`));


    const searchParamStr = searchParamArray.length > 0 ? `?${searchParamArray.join('&')}` : '';



    let isError = false;
    let errorMessage = await localeProv.translate('page.main.explorer.error.message')


    const treeData: RestListResult<ExplorerTreeEntity> = {
        count: 0,
        page: 0,
        pageSize: 0,
        row: [],
        totalPage: 0
    }

    const defaultFilterData: ExplorerFilterData = {
        pagination: {
            defaultPage: 1,
            defaultPageSize: 20
        },
        sort: {
            category: [],
            defaultCategory: {
                key: 'common',
                text: '기본'
            },
            defaultSortType: 'desc'
        }
    };


    try {
        const session = await AuthProvider.current().getSession();
        const locale = await ServerLocaleInitializer.current(LocaleConfig).get({ readCookie: await cookies() });

        const filterData = await RestExplorerDataService
            .current(session?.token, locale ?? LocaleConfig.defaultLocale)
            .getFilterData()


        defaultFilterData.sort.category.push(...(filterData.data?.sort.category ?? []));

        if (filterData.data?.sort.defaultCategory) {
            defaultFilterData.sort.defaultCategory.key = filterData.data.sort.defaultCategory.key;
            defaultFilterData.sort.defaultCategory.text = filterData.data.sort.defaultCategory.text;
        }

        defaultFilterData.sort.defaultSortType = filterData.data?.sort.defaultSortType ?? 'desc';


        const paramFilter: RestSearchFilterOptions = {
            sortType: StringUtil.isEmpty(searchParam?.sortType) ? defaultFilterData.sort.defaultSortType : searchParam?.sortType,
            sortCategory: StringUtil.isEmpty(searchParam?.sortCategory) ? defaultFilterData.sort.defaultCategory.key : searchParam?.sortCategory,
            page: isNaN(Number(searchParam?.page)) ? defaultFilterData.pagination.defaultPage : Number(searchParam?.page),
            pageSize: isNaN(Number(searchParam?.pageSize)) ? defaultFilterData.pagination.defaultPageSize : Number(searchParam?.pageSize),
            keyword: StringUtil.isEmpty(searchParam?.keyword) ? undefined : searchParam?.keyword
        }

        const restResult = await RestExplorerDataService.current(session?.token, locale ?? LocaleConfig.defaultLocale)
            .getChild(params?.uid ?? 'NTF', paramFilter)



        if (!restResult.success) {
            throw new CustomProcessError(restResult.message ?? errorMessage);
        }

        treeData.count = restResult.data?.count ?? 0;
        treeData.page = restResult.data?.page ?? 0;
        treeData.pageSize = restResult.data?.pageSize ?? 0;
        treeData.row = restResult.data?.row ?? []
        treeData.totalPage = restResult.data?.totalPage ?? 0


    }
    catch (e) {
        if (e instanceof CustomProcessError) {
            errorMessage = (e as Error).message;
        }
        isError = true;
    }

    // #endregion PROCESS


    return (
        <CommonPage
            className='cp-explorer-page'
            fixed
        >
            <ExplorerListValidateProvider
                defaultFilterData={defaultFilterData}
                treeData={treeData}
            />
            <CommonPage.Header>
                <div className='cp-top-header'>
                    <div className='cp-flex-left'>
                        <HistoryBackButton className='cp-back-bt' />
                    </div>
                    <div className='cp-flex-right'>
                        <ExplorerNewFolderButton
                            folderUid={params?.uid}
                        />
                        <ExplorerFileUploadButton
                            folderUid={params?.uid}
                        />
                    </div>

                </div>
                <ExplorerToolbar
                    defaultFilter={defaultFilterData}
                />
            </CommonPage.Header>
            <CommonPage.Content>
                <GroupBox className='cp-file-list-box'>
                    <Suspense fallback={<ExplorerListLoading />}>
                        {
                            isError
                                ? <div className='cp-load-error'>
                                    <div className='cp-error-icon'>
                                        <FcHighPriority size={50} />
                                    </div>
                                    <div className='cp-error-message'>
                                        {errorMessage}
                                    </div>
                                    <div className='cp-refresh'>
                                        <Link href={'/explorer'} className='cp-refresh-bt' >
                                            {localeProv.translate('page.main.explorer.error.reload')}
                                        </Link>
                                    </div>
                                </div>
                                : <ExplorerListTable
                                    uid={params?.uid ?? 'ROOT'}
                                    treeData={treeData}
                                    defaultFilterData={defaultFilterData}
                                    searchParam={searchParamStr}
                                />
                        }

                    </Suspense>
                </GroupBox>
            </CommonPage.Content>
        </CommonPage>
    )
}

export default MainExplorerListPage;