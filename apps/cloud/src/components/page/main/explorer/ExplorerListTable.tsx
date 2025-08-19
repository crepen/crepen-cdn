'use server'

import { LocaleConfig } from "@web/lib/config/LocaleConfig";
import { ServerLocaleProvider } from "@web/lib/module/locale/ServerLocaleProvider";
import { StringUtil } from "@web/lib/util/StringUtil";
import Link from "next/link";
import { FcFile, FcOpenedFolder } from "react-icons/fc";
import { ExplorerListTableFooter } from "./ExplorerListTableFooter";
import { ExplorerFilterData, ExplorerTreeEntity } from "@web/lib/types/api/dto/RestExplorerDto";
import { RestListResult } from "@web/lib/types/api/dto/RestCommonDto";


interface ExplorerListTableProp {
    uid: string,
    treeData : RestListResult<ExplorerTreeEntity>,
    defaultFilterData? : ExplorerFilterData
}

export const ExplorerListTable = async (prop: ExplorerListTableProp) => {

 
    const localeProv = ServerLocaleProvider.current(LocaleConfig);

    return (
        <div className="cp-file-list">

            <div className="cp-list-table">
                <div className="cp-table-header">
                    <ul className="cp-table-row cp-header-row">
                        <li className="cp-item-icon"></li>
                        <li className="cp-item-title">{await localeProv.translate('page.main.explorer.list.header.title')}</li>
                        <li className="cp-item-size">{await localeProv.translate('page.main.explorer.list.header.size')}</li>
                        <li className="cp-item-action">{await localeProv.translate('page.main.explorer.list.header.action')}</li>
                    </ul>
                </div>
                <div className="cp-table-content">
                    {
                        prop.treeData.row.map((item, idx) => (
                            <ul
                                key={idx}
                                className="cp-table-row cp-item-row"
                                data-type={item.childType}
                            >
                                <li className="cp-item-icon">
                                    {
                                        item.childType === 'file'
                                            ? <FcFile className='cp-icon' size={20} />
                                            : <FcOpenedFolder className='cp-icon' size={20} />
                                    }
                                </li>
                                <li
                                    className="cp-item-title"
                                    title={item.title}
                                >

                                    <Link
                                        href={
                                            item.childType === 'folder'
                                                ? `/explorer/${item.childLinkUid}`
                                                : `/explorer/file/${item.childLinkUid}`
                                        }
                                        className="cp-item-link"
                                    >
                                        {item.title}
                                    </Link>
                                </li>
                                <li className="cp-item-size">
                                    {
                                        item.childType === 'file'
                                            ? StringUtil.convertFormatByte(item.fileSize, 2)
                                            : ''
                                    }
                                </li>
                                <li className="cp-item-action">

                                </li>
                            </ul>
                        ))
                    }
                </div>
                <ExplorerListTableFooter
                    startLimit={((prop.treeData.page ?? 0) - 1) * (prop.treeData.pageSize ?? 0) + 1}
                    endLimit={((prop.treeData.page ?? 0) - 1) * (prop.treeData.pageSize ?? 0) + (prop.treeData.pageSize ?? 0)}
                    totalCount={prop.treeData.count}
                    page={prop.treeData.page}
                    pageSize={prop.treeData.pageSize}
                    totalPage={prop.treeData.totalPage}
                    defaultFilterData={prop.defaultFilterData}
                />

            </div>
        </div>
    )
}

export const ExplorerListLoading = async () => {



    return (
        <div className="cp-file-list-loading">
            <div className="cp-loading-dot" />
            <div className="cp-loading-dot" />
            <div className="cp-loading-dot" />
            <div className="cp-loading-dot" />
            <div className="cp-loading-dot" />
        </div>
    )
}