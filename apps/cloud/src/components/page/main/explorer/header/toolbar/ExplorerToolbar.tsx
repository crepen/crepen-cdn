'use client'

import { FcSearch } from "react-icons/fc";
import { Fragment } from "react";
import { ExplorerSortTypeButton } from "./ExplorerSortTypeButton";
import { ExplorerSortCategoryButton } from "./ExplorerSortCategoryButton";
import { ExplorerFilterData } from "@web/lib/types/api/dto/RestExplorerDto";
import { ExplorerSearchKeywordInput } from "./ExplorerSearchKeywordInput";
import { ExplorerRefreshButton } from "./ExplorerRefreshButton";

interface ExplorerToolbarProp {
    
    defaultFilter? : ExplorerFilterData
}

export const ExplorerToolbar = (prop: ExplorerToolbarProp) => {




    return (
        <div className='cp-toolbar-header'>
            <div className='cp-flex-left'>
               <ExplorerSearchKeywordInput />
            </div>
            <div className='cp-flex-right'>
                {
                    (prop.defaultFilter?.sort.category ?? []).length > 0 &&
                    <Fragment>
                        <ExplorerSortTypeButton 
                            defaultSortType={prop.defaultFilter?.sort.defaultSortType ?? 'desc'}
                        />
                        <ExplorerSortCategoryButton 
                            categoryList={prop.defaultFilter?.sort.category ?? []}
                            defaultCategory={prop.defaultFilter?.sort.defaultCategory ?? (prop.defaultFilter?.sort.category ?? [])[0]!}
                        />
                        <ExplorerRefreshButton />
                    </Fragment>
                }

            </div>


        </div>
    )
}