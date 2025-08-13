'use client'

import { useClientLocale } from "@web/lib/module/locale/ClientLocaleProvider"
import { FcAlphabeticalSortingAz, FcAlphabeticalSortingZa, FcSearch } from "react-icons/fc";
import { Fragment, useEffect } from "react";
import { ArrayUtil } from "@web/lib/util/ArrayUtil";
import { useExplorerFilter } from "../../provider/ExplorerFilterProvider";
import { ExplorerSortTypeButton } from "./ExplorerSortTypeButton";
import { ExplorerSortCategoryButton } from "./ExplorerSortCategoryButton";

interface ExplorerToolbarProp {
    sortOptions?: {
        defaultSortType?: string,
        defaultSortCategory?: string
    }
}

export const ExplorerToolbar = (prop: ExplorerToolbarProp) => {

    const localeHook = useClientLocale();
    const explorerSearchHook = useExplorerFilter();


    useEffect(() => {
        if (prop.sortOptions) {
            explorerSearchHook.setSort(prop.sortOptions?.defaultSortType, prop.sortOptions?.defaultSortCategory);
        }
    }, [])


    return (
        <div className='cp-toolbar-header'>
            <div className='cp-flex-left'>
                <div className='cp-search-box'>
                    <div className='cp-search-icon'>
                        <FcSearch />
                    </div>
                    <input className='cp-search-input' />
                </div>
            </div>
            <div className='cp-flex-right'>
                {
                    explorerSearchHook.sort?.active === true &&
                    <Fragment>
                        <ExplorerSortTypeButton />
                        <ExplorerSortCategoryButton />
                    </Fragment>
                }

            </div>


        </div>
    )
}