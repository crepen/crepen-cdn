'use client'

import { useSelectFolderItem } from "../../../containers/folder-select-item-provider/FolderSelectItemProvider"


export const FolderAllItemCheckButton = () => {

    const selectFolderItemHook = useSelectFolderItem();

    return (
        <button
            onClick={() => {
                const allCheckFunc = selectFolderItemHook.event.getEvent('all-check');
                if (allCheckFunc) {
                    allCheckFunc();
                }
            }}
        >
            All Check
        </button>
    )
}