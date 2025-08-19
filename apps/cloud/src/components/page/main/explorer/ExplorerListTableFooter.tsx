'use client'

import { useRouter, useSearchParams } from "next/navigation"
import { Fragment } from "react"
import { MdFirstPage, MdLastPage } from "react-icons/md"
import { StringUtil } from "@web/lib/util/StringUtil"
import { ExplorerListTablePageSizeButton } from "./ExplorerListTablePageSizeButton"
import { ExplorerFilterData } from "@web/lib/types/api/dto/RestExplorerDto"
import { useClientLocale } from "@web/lib/module/locale/ClientLocaleProvider"

interface ExplorerListTableFooterProp {
    startLimit?: number,
    endLimit?: number,
    totalCount?: number,
    page?: number,
    pageSize?: number,
    totalPage?: number,
    defaultFilterData?: ExplorerFilterData
}

export const ExplorerListTableFooter = (prop: ExplorerListTableFooterProp) => {

    const router = useRouter();
    const searchParamHook = useSearchParams();


    const movePageHandler = (page: number) => {
        const params = new URLSearchParams(searchParamHook);

        params.set('page', page.toString());

        router.replace(`?${params.toString()}`);
    }


    return (
        <div className="cp-table-footer">
            <div className="cp-table-pagesize-dropdown">
                <ExplorerListTablePageSizeButton
                    currentPageSize={prop.pageSize ?? 0}
                    defaultPageSize={prop.defaultFilterData?.pagination.defaultPageSize ?? 0}
                />
            </div>
            <div className="cp-table-pagination">
                <button
                    className="cp-pagination-bt cp-static-bt cp-first-page-bt"
                    onClick={() => movePageHandler(1)}
                    disabled={!((prop.page ?? 0) > 3)}
                >
                    <MdFirstPage />
                </button>
                {
                    new Array(5).fill(
                        (prop.page ?? 0) < 3
                            ? 3
                            : (prop.totalPage ?? 0) - 2 < (prop.page ?? 1)
                                ? (prop.totalPage ?? 0) - 2
                                : prop.page ?? 1
                    ).map((dt, idx) => {
                        if ((idx + dt - 2) > (prop.totalPage ?? 0)) {
                            return undefined;
                        }
                        else {
                            return (
                                <button
                                    key={idx + dt}
                                    className={StringUtil.joinClassName("cp-pagination-bt", "cp-move-page-bt", ((idx + dt - 2) === prop.page) ? 'cp-current-page' : '')}
                                    onClick={() => movePageHandler(idx + dt - 2)}
                                >
                                    {
                                        idx + dt - 2
                                    }
                                </button>
                            )
                        }


                    })
                }

                <button
                    className="cp-pagination-bt cp-static-bt cp-last-page-bt"
                    onClick={() => movePageHandler(prop.totalPage ?? 0)}
                    disabled={!((prop.page ?? 0) < (prop.totalPage ?? 0) - 2)}
                >
                    <MdLastPage />
                </button>

            </div>
            <div className="cp-table-list-count">
                {
                    (prop.startLimit && prop.endLimit && prop.totalCount) &&
                    <Fragment>
                        <span>{prop.startLimit}</span>
                        <span> - </span>
                        <span>{prop.endLimit > prop.totalCount ? prop.totalCount : prop.endLimit}</span>
                        <span>/</span>
                        <span>{prop.totalCount}</span>
                    </Fragment>
                }

            </div>
        </div>
    )
}