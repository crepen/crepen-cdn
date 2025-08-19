import { FcAlphabeticalSortingAz, FcAlphabeticalSortingZa } from "react-icons/fc";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface ExplorerSortTypeButtonProp {
    defaultSortType: 'asc' | 'desc'
}

export const ExplorerSortTypeButton = (prop: ExplorerSortTypeButtonProp) => {

    const [applyType, setType] = useState<'asc' | 'desc'>(prop.defaultSortType);

    const searchParamHook = useSearchParams();
    const router = useRouter();

    const changeSortTypeEventHandler = (changeType: 'asc' | 'desc') => {
        setType(changeType);

        const params = new URLSearchParams(searchParamHook);

        params.set('sortType', changeType);

        router.replace(`?${params.toString()}`);
    }


    useEffect(() => {
        const params = new URLSearchParams(searchParamHook);
        const querySortType = params.has('sortType') ? params.get('sortType') : undefined;

        setType(querySortType === 'asc' ? 'asc' : 'desc');
    }, [searchParamHook])

    return (
        <button className="cp-header-bt cp-sort-type-bt"
            onClick={() => {
                changeSortTypeEventHandler(applyType === 'asc' ? "desc" : 'asc')
            }}
        >
            <div className="cp-button-icon">
                {
                    applyType === 'asc'
                        ? <FcAlphabeticalSortingAz size={20} />
                        : <FcAlphabeticalSortingZa size={20} />
                }
            </div>
        </button>
    )
}