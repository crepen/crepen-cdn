'use client'

import { useClientLocale } from "@web/lib/module/locale/ClientLocaleProvider";
import { useExplorerFilter } from "../../provider/ExplorerFilterProvider";
import { ArrayUtil } from "@web/lib/util/ArrayUtil";
import { useEffect, useState } from "react";

export const ExplorerSortCategoryButton = () => {


    const explorerSearchHook = useExplorerFilter();
    const localeHook = useClientLocale();



    return (
        <button className='cp-header-bt cp-sort-category-bt'>
            <div className='cp-button-text'>
                {localeHook.translate('page.main.explorer.header.button.sort')} : {localeHook.translate(`page.main.explorer.header.sort.category.${explorerSearchHook.sort?.category ?? ArrayUtil.firstOrUndefined<string>(explorerSearchHook.sort?.allowCategories) ?? ''}`)}
            </div>

        </button>
    )
}