'use client'

import './FolderRemoveItemButton.scss'
import { useRouter } from "next/navigation"
import { FolderRemoveItemModal } from "./FolderRemoveItemModal"
import { useGlobalLoading } from '@web/component/config/GlobalLoadingProvider'
import { useGlobalModal } from '@web/component/config/GlobalModalProvider'
import { SelectFolderItemProp, useSelectFolderItem } from '../../../containers/folder-select-item-provider/FolderSelectItemProvider'
import { useGlobalBasePath } from '@web/component/config/GlobalBasePathProvider'
import { FileAction } from '@web/modules/server/action'
import { CommonComponentError } from '@web/modules/common/error/component/CommonComponentError'
import { useGlobalLocale } from '@web/component/config/GlobalLocaleProvider'


export const FolderRemoveItemButton = () => {

    const selectFolderItemHook = useSelectFolderItem();
    const globalLoading = useGlobalLoading();
    const router = useRouter();
    const globalModalHook = useGlobalModal();
    const localHook = useGlobalLocale();



    const removeItem = async (itemType: 'file' | 'folder', uid: string) => {
        try {

            await FileAction.removeFile(uid);


            selectFolderItemHook.remove({
                type: itemType,
                uid: uid
            })


        }
        catch (e) {
            if (e instanceof CommonComponentError) {
                throw e;
            }
            else {
                throw new CommonComponentError(
                    localHook.getTranslation('common.system.UNKNOWN_ERROR'),
                    e as Error
                );
            }
        }
    }

    const onSubmit = async () => {
        globalLoading.setState(true);
        globalModalHook.close();
        const selectItems = selectFolderItemHook.value;

        // const promiseList: Promise<unknown>[] = [];
        let successList = [];
        let errorList: { item: SelectFolderItemProp, message?: string }[] = [];

        for (const item of selectItems) {
            try {
                await removeItem(item.type, item.uid);
                successList.push(item);

            }
            catch (e) {
                errorList.push({ item: item, message: (e as Error).message });
               
            }
        }


        if (errorList.length > 0) {
            alert(errorList[0]?.message);
        }


        selectFolderItemHook.remove(...successList);

        router.refresh();
        globalLoading.setState(false);
    }

    const onClickEventHandler = async () => {

        if (selectFolderItemHook.value.length === 0) {
            alert(localHook.getTranslation('page.folder.NON_SELECT_REMOVE_ITEM'));
        }
        else {
            globalModalHook.setOpen(
                <FolderRemoveItemModal
                    removeFileCount={selectFolderItemHook.value.filter(x => x.type === 'file').length}
                    removeFolderCount={selectFolderItemHook.value.filter(x => x.type === 'folder').length}
                    onSubmit={() => {
                        onSubmit();
                    }}
                />
            )

        }







    }

    return (
        <button
            onClick={onClickEventHandler}
            data-visible={selectFolderItemHook.value.length > 0}
            className="cp-folder-remove-item-bt"
        >
            Remove Item
        </button>
    )
}