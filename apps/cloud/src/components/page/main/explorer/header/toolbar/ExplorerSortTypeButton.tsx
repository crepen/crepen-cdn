import { FcAlphabeticalSortingAz, FcAlphabeticalSortingZa } from "react-icons/fc";
import { useExplorerFilter } from "../../provider/ExplorerFilterProvider";

export const ExplorerSortTypeButton = () => {
     const explorerSearchHook = useExplorerFilter();

    return (
        <button className="cp-header-bt cp-sort-type-bt"
            onClick={() => {
                const searchData = explorerSearchHook.sort;

                if (searchData?.type === 'asc') {
                    explorerSearchHook.setSort('desc');
                }
                else if (searchData?.type === 'desc') {
                    explorerSearchHook.setSort('asc');
                }
            }}
        >
            {
                explorerSearchHook.sort?.type === 'asc'
                    ? <FcAlphabeticalSortingAz size={20} />
                    : <FcAlphabeticalSortingZa size={20} />
            }
        </button>
    )
}