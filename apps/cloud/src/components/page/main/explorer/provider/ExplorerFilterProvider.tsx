import { ArrayUtil } from "@web/lib/util/ArrayUtil"
import { useRouter, useSearchParams } from "next/navigation"
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from "react"


interface ExplorerFilterSortData {
    category?: string,
    type?: string,
    active?: boolean,
    allowCategories?: string[]
}

interface ExplorerFilterSearchData {

}

export interface ExplorerFilterData {
    sort?: ExplorerFilterSortData,
    search?: ExplorerFilterSearchData
}

interface ExplorerFilterContextProp {
    setSort: (type?: string, category?: string) => void,
    isActiveSort: () => boolean,
    sort?: ExplorerFilterSortData,
    search?: ExplorerFilterSearchData
}

interface ExplorerFilterProviderProp extends PropsWithChildren {
    sortOption?: {
        activeSort?: boolean,
        allowCategory?: string[],
        defaultCategory?: string,
        defaultType?: string
    }
}


const ExplorerFilterContext = createContext<ExplorerFilterContextProp | undefined>(undefined);


export const useExplorerFilter = () => {
    const context = useContext(ExplorerFilterContext);
    if (context === undefined) throw new Error("useExplorerFilter must be used within Provider");
    return context;
}





export const ExplorerFilterProvider = (prop: ExplorerFilterProviderProp) => {

    const searchParamHook = useSearchParams();
    const router = useRouter();

    const [sortData, setSortData] = useState<ExplorerFilterSortData | undefined>({
        allowCategories: prop.sortOption?.allowCategory ?? [],
        type: ArrayUtil.isContain(['asc', 'desc'], prop.sortOption?.defaultType)
            ? prop.sortOption?.defaultType
            : 'desc',
        category: ArrayUtil.isContain(prop.sortOption?.allowCategory ?? [], prop.sortOption?.defaultCategory) 
        ? prop.sortOption?.defaultCategory 
        : (prop.sortOption?.allowCategory ?? []).length > 0
            ? prop.sortOption!.allowCategory![0]
            : undefined,
        active : prop.sortOption?.activeSort && (prop.sortOption.allowCategory ?? []).length > 0
    });

    const [searchData, setSearchData] = useState<ExplorerFilterSearchData | undefined>(undefined);


    // useEffect(() => {
    //     console.log('CHANGE' , sortData)
    // },[sortData])


    return (
        <ExplorerFilterContext.Provider
            value={{
                setSort: (type?: string, category?: string) => {


                    const applyData = { ...sortData };

                    if (ArrayUtil.isContain(['asc', 'desc'], type)) {
                        applyData.type = type;
                    }

                    if (ArrayUtil.isContain(applyData.allowCategories ?? [], category?.toLowerCase())) {
                        applyData.category = category?.toLowerCase();
                    }

                    const params = new URLSearchParams(searchParamHook);
                    if (applyData.type) params.set('sortType', applyData.type);
                    if (applyData.category) params.set('sortCategory', applyData.category);

                    router.push(`?${params.toString()}`);



                    setSortData({
                        active: applyData.active,
                        allowCategories: applyData.allowCategories,
                        category: applyData.category,
                        type: applyData.type
                    });
                },
                isActiveSort: () => {
                    if (sortData?.active === true && (sortData.allowCategories ?? []).length > 0) {
                        return true;
                    }

                    return false;
                },
                sort: sortData,
                search: searchData
            }}
        >
            {prop.children}
        </ExplorerFilterContext.Provider>
    )
}