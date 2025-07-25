'use client'

import './FolderRemoveItemButton.scss'
import { MouseEvent } from "react"
import { useRouter } from "next/navigation"
import { CrepenComponentError } from "@web/modules/common-1/error/CrepenComponentError"
import { FolderRemoveItemModal } from "./FolderRemoveItemModal"
import { useGlobalBasePath } from '@web/modules/client/state/global.state'
import { useGlobalLoading } from '@web/component/config/GlobalLoadingProvider'
import { useGlobalModal } from '@web/component/config/GlobalModalProvider'
import { useSelectFolderItem } from '../../../containers/folder-select-item-provider/FolderSelectItemProvider'


export const FolderRemoveItemButton = () => {

    const selectFolderItemHook = useSelectFolderItem();
    const globalLoading = useGlobalLoading();
    const basePath = useGlobalBasePath();
    const router = useRouter();
    const globalModalHook = useGlobalModal();


    const removeItem = async (itemType: 'file' | 'folder', uid: string) => {
        try {

            const apiUrl = `${basePath.value}/api/${itemType}/${uid}`;

            const updateRequest = await fetch(apiUrl, {
                method: 'DELETE'
            })

            try {
                const data = await updateRequest.json();

                if (data.success !== true) {
                    throw new CrepenComponentError(data.message, data.statusCode);
                }


            }
            catch (e) {
                if (e instanceof CrepenComponentError) {
                    throw e;
                }
                else {
                    throw new CrepenComponentError('Request Failed', 500, e as Error);
                }
            }

            selectFolderItemHook.remove({
                type: itemType,
                uid: uid
            })

        }
        catch (e) {
            if (e instanceof CrepenComponentError) {
                throw e;
            }
            else {
                throw new CrepenComponentError('Request Failed', 500, e as Error);
            }
        }
    }

    const onSubmit = async () => {
        globalLoading.setState(true);
        globalModalHook.close();
        const selectItems = selectFolderItemHook.value;

        // const promiseList: Promise<unknown>[] = [];
        let successList = [];
        let errorList = [];

        for (const item of selectItems) {
            try {
                await removeItem(item.type, item.uid);
                successList.push(item);

            }
            catch (e) {
                errorList.push(item);
                console.log("REMOVE ERROR", item);
            }
        }


        selectFolderItemHook.remove(...successList);

        router.refresh();
        globalLoading.setState(false);
    }

    const onClickEventHandler = async (e: MouseEvent<HTMLButtonElement>) => {

        if (selectFolderItemHook.value.length === 0) {
            alert('Not Selected items.');
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