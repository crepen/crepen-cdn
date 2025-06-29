'use client'


import './FolderItemListContainer.scss'
import { CrepenFile } from "@web/modules/crepen/explorer/file/dto/CrepenFile"
import { CrepenFolder } from "@web/modules/crepen/explorer/folder/dto/CrepenFolder"
import { Virtuoso } from 'react-virtuoso'
import { FolderLinearItem } from "../../controls/folder-linear-item/FolderLinearItem"
import { useDropzone } from 'react-dropzone'
import { useFileUploadState } from '@web/modules/common/state/useFileUploadState'
import { StringUtil } from '@web/lib/util/string.util'
import { useEffect, useRef, useState } from 'react'

interface FolderItemListContainerProp {
    folderUid: string,
    parentFolderUid?: string,
    dataList: FolderItemData[]
}

interface FolderItemData {
    type: string,
    data: CrepenFile | CrepenFolder
}

export const FolderItemListContainer = (prop: FolderItemListContainerProp) => {

    const uploadHook = useFileUploadState();

    const listRef = useRef<HTMLDivElement>(null);

    const [selectItemUid, setSelectItemUid] = useState<{ type: 'folder' | 'file', uid: string }[]>([]);

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
        onDrop: (acceptedFiles, fileRejections) => {
            console.log('Accepted files:', acceptedFiles);
            console.log('Rejected files:', fileRejections);
            uploadHook.uploadData(acceptedFiles, prop.folderUid);
        },
        noClick: true,
    })





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
                totalCount={prop.dataList.length + (StringUtil.isEmpty(prop.parentFolderUid) ? 0 : 1)}
                itemContent={(idx) => {
                    let targetIdx = idx;

                    if (!StringUtil.isEmpty(prop.parentFolderUid)) {
                        targetIdx--;
                        if (idx === 0) {
                            return (
                                <FolderLinearItem
                                    type="folder"
                                    title={'.. Parent Folder'}
                                    uid={prop.parentFolderUid!}
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
                                    selectItemUid.filter(
                                        x => x.type === 'folder'
                                            && x.uid === objData.uid
                                    ).length > 0
                                }
                                onSelectChange={(isSelect) => {
                                    if (isSelect) {
                                        setSelectItemUid([
                                            ...selectItemUid,
                                            { type: 'folder', uid: objData.uid }
                                        ])
                                    }
                                    else {
                                        setSelectItemUid(
                                            selectItemUid.filter(
                                                x=> !(x.type === 'folder'
                                                && x.uid === objData.uid)
                                            )
                                        );
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
                                isFileShared={objData.isShared}
                                isSelected={
                                    selectItemUid.filter(
                                        x => x.type === 'file'
                                            && x.uid === objData.uid
                                    ).length > 0
                                }
                                onSelectChange={(isSelect) => {
                                    if (isSelect) {
                                        setSelectItemUid([
                                            ...selectItemUid,
                                            { type: 'file', uid: objData.uid }
                                        ])
                                    }
                                    else {
                                        setSelectItemUid(
                                            selectItemUid.filter(
                                                x=> !(x.type === 'file'
                                                && x.uid === objData.uid)
                                            )
                                        );
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