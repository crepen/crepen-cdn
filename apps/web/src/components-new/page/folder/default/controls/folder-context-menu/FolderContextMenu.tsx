import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CrepenContextItem } from "@web/components-new/common/controls/context-menu/CrepenContextItem";
import { CrepenContextMenu, CrepenContextMenuRef } from "@web/components-new/common/controls/context-menu/CrepenContextMenu";
import { useGlobalBasePath, useGlobalLoadingState } from "@web/lib/state/global.state";
import { CrepenFile } from "../../../../../../modules/crepen/explorer/file/dto/CrepenFile";
import { useRouter } from "next/navigation";
import { Ref, useState, useImperativeHandle, useRef } from "react";
import { CrepenFolder } from "@web/modules/crepen/explorer/folder/dto/CrepenFolder";
import { CrepenComponentError } from "@web/modules/common/error/CrepenComponentError";

interface FolderContextMenuProp {
    ref: Ref<FolderContextMenuRef>
}

export interface FolderContextMenuRef {
    setState: (isOpen: boolean, position: { x?: number, y?: number }) => void,
    setData: (type: 'file' | 'folder', data: CrepenFile | CrepenFolder) => void,
}

export const FolderContextMenu = (prop: FolderContextMenuProp) => {

    // const baseContextRef = useRef<HTMLDivElement>(null);
    const baseContextCustomRef = useRef<CrepenContextMenuRef>(null);

    const [itemType, setItemType] = useState<'file' | 'folder' | undefined>(undefined);
    const [itemData, setItemData] = useState<CrepenFile | CrepenFolder | undefined>(undefined);

    const route = useRouter();
    const globalLoadingHook = useGlobalLoadingState();
    const basePath = useGlobalBasePath();


    useImperativeHandle(prop.ref, () => ({
        setState: (isOpen: boolean, position: { x?: number, y?: number }) => {
            baseContextCustomRef.current?.setState(isOpen, position);
        },

        setData: (type: 'file' | 'folder', data: CrepenFile | CrepenFolder) => {
            setItemType(type);
            setItemData(data)
        }
    }))



    //#region ACTION_EVENT

    const updateSharedState = async (isPublished: boolean, fileUid: string) => {
        try {
            console.log(`UPDATE SHARED STATE : ${isPublished} ====> ${fileUid}`)

            globalLoadingHook.active(true);

            const apiUrl = `${basePath.value}/api/file/${fileUid}`;
            console.log(apiUrl);

            const updateRequest = await fetch(apiUrl, {
                method: 'POST',
                body: JSON.stringify({
                    isPublished: isPublished
                })
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



            globalLoadingHook.active(false);
            route.refresh();
        }
        catch (e) {
            globalLoadingHook.active(false);
            if (e instanceof CrepenComponentError) {
                throw e;
            }
            else {
                throw new CrepenComponentError('Request Failed', 500, e as Error);
            }
        }
    }

    const removeData = async (uid: string) => {
        try {
            console.log(`DELETE ${itemType?.toUpperCase()} : ${uid}`)

            globalLoadingHook.active(true);

            const apiUrl = `${basePath.value}/api/${itemType}/${uid}`;
            console.log(apiUrl);

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



            globalLoadingHook.active(false);
            route.refresh();
        }
        catch (e) {
            globalLoadingHook.active(false);
            if (e instanceof CrepenComponentError) {
                throw e;
            }
            else {
                throw new CrepenComponentError('Request Failed', 500, e as Error);
            }
        }
    }


    //#endregion ACTION_EVENT



    return (
        <CrepenContextMenu
            itemRef={baseContextCustomRef}
        >
            {
                itemType === 'file' &&
                <CrepenContextItem
                    className="cp-context-file-shared-bt"
                    onClick={() => {
                        const file = itemData as CrepenFile;
                        updateSharedState(!file.isPublished, file.uid)
                            .catch(err => {
                                if (err instanceof CrepenComponentError) {
                                    console.group('Fetch Error');
                                    console.log(err.message);
                                    console.log(err.innerError);
                                    console.groupEnd();
                                    alert(err.message);
                                }
                                else {
                                    alert('Unknown Error');
                                }

                            })
                            .finally(() => {
                                baseContextCustomRef.current?.setState(false);
                            })

                    }}
                >
                    {
                        (itemData as CrepenFile).isPublished
                            ? 'Disconnect Share'
                            : 'Connect Share'
                    }
                </CrepenContextItem>
            }
            {
                itemType === 'file' &&
                <CrepenContextItem
                    className="cp-context-file-download-bt"
                >
                    Download File
                </CrepenContextItem>
            }
            <CrepenContextItem
                className="cp-context-data-delete-bt"
                onClick={() => {
                    if (itemData?.uid) {
                        removeData(itemData.uid)
                            .then(() => {
                                // baseContextCustomRef.current?.setState(false);
                            })
                            .catch(err => {
                                if (err instanceof CrepenComponentError) {
                                    console.group('Fetch Error');
                                    console.log(err.message);
                                    console.log(err.innerError);
                                    console.groupEnd();
                                    alert(err.message);
                                }
                                else {
                                    alert('Unknown Error');
                                }

                            })
                            .finally(() => {
                                baseContextCustomRef.current?.setState(false);
                            })
                    }


                }}
            >
                <FontAwesomeIcon icon={faTrash} />
                DELETE
            </CrepenContextItem>
            <CrepenContextItem
                className="cp-context-data-info-bt"
                onClick={() => {

                    if (itemType === 'file') {
                        route.push(`/explorer/file/${itemData?.uid}`)
                    }
                    else if (itemType === 'folder') {
                        route.push(`/explorer/folder/${itemData?.uid}/setting`)
                    }
                }}
            >
                Info
            </CrepenContextItem>

        </CrepenContextMenu>
    )
}