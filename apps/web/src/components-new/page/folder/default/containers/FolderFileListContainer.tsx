'use client'

import './FolderFileListContainer.scss'

import { StringUtil } from "@web/lib/util/string.util"
import { CrepenFile } from "../../../../../modules/crepen/explorer/file/dto/CrepenFile"
import { Fragment, useEffect, useRef, useState } from "react"
import { FolderItem } from "../folder-item/FolderItem"
import { FolderContextMenu, FolderContextMenuRef } from "../controls/folder-context-menu/FolderContextMenu"
import { MoveParentFolderItem } from '../folder-item/MoveParentFolderItem'
import { CrepenFolder } from '@web/modules/crepen/explorer/folder/dto/CrepenFolder'

interface FolderFileListContainerProp {
    className?: string,
    data?: CrepenFolder
}

export const FolderFileListContainer = (prop: FolderFileListContainerProp) => {

    const [selectItem, setSelectItem] = useState<{ type: 'file' | 'folder', data: (CrepenFile | CrepenFolder) }[]>([])
    const contextMenuRef = useRef<FolderContextMenuRef>(null);


    const selectItemEvent = (type: 'file' | 'folder', data: CrepenFile | CrepenFolder) => {
        if (selectItem.filter(x => x.type === type && x.data.uid === data.uid).length > 0) {
            setSelectItem([]);
        }
        else {
            setSelectItem([{
                data: data,
                type: type
            }]);
        }

    }

    useEffect(() => {
        console.log('SELECT ITEM : ', selectItem);
    }, [selectItem])

    return (
        <Fragment>
            <div
                className={StringUtil.joinClassName('cp-folder-item-list', prop.className)}
                onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
            >
                {/* <FolderItem
                type='folder'
                title={'상위로 이동'}
                isSelect={selectItem.filter(x => x.type === 'folder' && x.data.uid === folder.uid).length > 0}
                onSelectChange={(isSelect: boolean, data: CrepenFolder | CrepenFile) => {
                    console.log(data.uid, isSelect);
                }}
              
            /> */}
                {
                    (
                        (prop.data?.parentFolderUid ?? undefined) === undefined
                        && ((prop.data?.childFolder ?? []).length + (prop.data?.files ?? []).length === 0)
                    ) &&
                    <div>
                        NO DATA
                    </div>
                }
                {
                    (prop.data?.parentFolderUid ?? undefined) !== undefined &&
                    <MoveParentFolderItem 
                        parentFolderUid={prop.data?.parentFolderUid}
                    />
                }
                {
                    (prop.data?.childFolder ?? []).map((folder, idx) => (
                        <FolderItem
                            key={idx}
                            type='folder'
                            value={folder.folderTitle}
                            data={folder}
                            isSelect={selectItem.filter(x => x.type === 'folder' && x.data.uid === folder.uid).length > 0}
                            onSelectChange={(isSelect: boolean, data: CrepenFolder | CrepenFile) => {
                                console.log(data.uid, isSelect);
                            }}
                            onClick={() => {
                                selectItemEvent('folder', folder)
                            }}
                            contextRef={contextMenuRef}
                        />
                    ))
                }

                {
                    (prop.data?.files ?? []).map((file, idx) => (
                        <FolderItem
                            key={idx}
                            type='file'
                            value={file.fileTitle}
                            data={file}
                            isSelect={selectItem.filter(x => x.type === 'file' && x.data.uid === file.uid).length > 0}
                            onSelectChange={(isSelect: boolean, data: CrepenFolder | CrepenFile) => {
                                console.log(data.uid, isSelect);
                            }}
                            onClick={() => {
                                selectItemEvent('file', file)
                            }}
                            contextRef={contextMenuRef}
                        />
                    ))
                }
            </div>


            <FolderContextMenu
                ref={contextMenuRef}
            />
        </Fragment>
    )
}