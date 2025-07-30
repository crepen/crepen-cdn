'use client'


import './FolderItemListContainer.scss'
import { Virtuoso } from 'react-virtuoso'
import { FolderLinearItem } from "../../controls/folder-linear-item/FolderLinearItem"
import { useDropzone } from 'react-dropzone'
import { useFileUploadState } from '@web/modules/common-1/state/useFileUploadState'
import { StringUtil } from '@web/lib/util/string.util'
import { useEffect, useRef } from 'react'
import { SelectFolderItemProp, useSelectFolderItem } from '../folder-select-item-provider/FolderSelectItemProvider'
import { useFolderData } from '../folder-info-provider/FolderDataProvider'
import { CrepenFile } from '@web/modules/crepen/service/explorer/file/dto/CrepenFile'
import { CrepenFolder } from '@web/modules/crepen/service/explorer/folder/dto/CrepenFolder'
import { FolderEntity } from '@web/lib/modules/api-server/entity/object/FolderEntity'
import { FileEntity } from '@web/lib/modules/api-server/entity/object/FileEntity'

interface FolderItemListContainerProp {
    dataList: FolderItemData[],
}


interface FolderItemData {
    type: string,
    data: FileEntity | FolderEntity,

}

export const FolderItemListContainer = (prop: FolderItemListContainerProp) => {

    const selectItemHook = useSelectFolderItem()

    const uploadHook = useFileUploadState();

    const listRef = useRef<HTMLDivElement>(null);

    const folderData = useFolderData();

    // const [selectItemUid, setSelectItemUid] = useState<{ type: 'folder' | 'file', uid: string }[]>([]);

    const dataSort = (x: FolderItemData, y: FolderItemData): number => {

        const xType = x.type === 'folder' ? -1 : 1;
        const yType = y.type === 'folder' ? -1 : 1;

        if (xType !== yType) {
            return xType > yType ? 1 : -1;
        }

        const xtitle = x.type === 'folder' ? (x.data as CrepenFolder).folderTitle : (x.data as CrepenFile).fileTitle;
        const ytitle = y.type === 'folder' ? (y.data as CrepenFolder).folderTitle : (y.data as CrepenFile).fileTitle;

        if (xtitle !== ytitle) {
            return xtitle > ytitle ? 1 : -1;
        }

        return 0;
    }


    const dropZoneHook = useDropzone({
        onDrop: (acceptedFiles) => {
            uploadHook.uploadData(acceptedFiles, folderData.uid!, folderData.folderTitle!);
        },
        noClick: true,
    })


    useEffect(() => {

        selectItemHook.event.subscribe('all-check', () => {
         

            selectItemHook.update([
                ...prop.dataList.map(x => ({
                    type: x.type,
                    uid: x.data.uid
                }) as SelectFolderItemProp)
            ])
        })
    }, [])



    return (
        <div
            {...dropZoneHook.getRootProps({
                className: "cp-item-list-dropzone",
                'data-enable-dropzone': dropZoneHook.isDragActive,
                ref: listRef
            })}
        >

            <Virtuoso
                className="cp-item-list"
                totalCount={prop.dataList.length + (StringUtil.isEmpty(folderData.parentFolderUid) ? 0 : 1)}
                itemContent={(idx) => {
                    let targetIdx = idx;

                    if (!StringUtil.isEmpty(folderData.parentFolderUid)) {
                        targetIdx--;
                        if (idx === 0) {
                            return (
                                <FolderLinearItem
                                    type="folder"
                                    title={'.. Parent Folder'}
                                    uid={folderData.parentFolderUid!}
                                    disableSelect

                                />
                            )
                        }
                    }

                    const obj = prop.dataList.sort(dataSort)[targetIdx];

                    if (obj?.type === 'folder') {
                        const objData = obj.data as CrepenFolder;
                        return (
                            <FolderLinearItem
                                type="folder"
                                title={objData.folderTitle}
                                uid={objData.uid}
                                isSelected={
                                    selectItemHook.value.filter(
                                        x => x.type === 'folder'
                                            && x.uid === objData.uid
                                    ).length > 0
                                }
                                onSelectChange={(isSelect) => {
                                
                                    if (isSelect) {
                                        selectItemHook.update([
                                            { type: 'folder', uid: objData.uid }
                                        ])
                                    }
                                    else {
                                        selectItemHook.remove({
                                            type: 'folder',
                                            uid: objData.uid
                                        })
                                    }
                                }}
                            />
                        )
                    }
                    else if (obj?.type === 'file') {
                        const objData = obj.data as CrepenFile;
                        return (
                            <FolderLinearItem
                                type="file"
                                title={objData.fileTitle}
                                uid={objData.uid}
                                fileType={objData.fileStore?.fileType}
                                size={objData.fileStore?.fileSize}
                                isFileShared={objData.isPublished}
                                isSelected={
                                    selectItemHook.value.filter(
                                        x => x.type === 'file'
                                            && x.uid === objData.uid
                                    ).length > 0
                                }
                                onSelectChange={(isSelect) => {
                                  
                                    if (isSelect) {
                                        selectItemHook.update([
                                            { type: 'file', uid: objData.uid }
                                        ])
                                    }
                                    else {
                                        selectItemHook.remove({
                                            type: 'file',
                                            uid: objData.uid
                                        })
                                    }
                                }}
                            />
                        )
                    }


                }}
            />

            <input {...dropZoneHook.getInputProps({
                className: 'cp-dropzone-input'
            })} />

            <div className="cp-dropzone-viewbox">
                Drag & Drop
            </div>
        </div >

    )
}