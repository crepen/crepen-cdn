'use client'

import { Fragment, KeyboardEvent, MouseEvent, RefObject, TouchEvent, useRef, useState } from 'react'
import { CrepenFile } from '../../../../../modules/crepen/explorer/file/dto/CrepenFile'
import { useRouter } from 'next/navigation'
import { FolderContextMenuRef } from '../controls/folder-context-menu/FolderContextMenu'
import { useCheckMobileAgent } from '@web/lib/hook/useCheckMobileAgent'
import { BaseFolderItem } from './BaseFolderItem'
import { CrepenFolder } from '@web/modules/crepen/explorer/folder/dto/CrepenFolder'
import { MimeUtil } from '@web/lib/util/mime.util'
import { faImage } from '@fortawesome/free-regular-svg-icons'
import { faVideo } from '@fortawesome/free-solid-svg-icons'

interface FolderItemProp {
    type: 'file' | 'folder',
    value?: string,
    data: CrepenFolder | CrepenFile,
    isSelect?: boolean,
    onSelectChange?: (isSelect: boolean, data: CrepenFolder | CrepenFile) => void,
    onClick?: (e: MouseEvent<HTMLDivElement>) => void,
    contextRef?: RefObject<FolderContextMenuRef | null>
}

export const FolderItem = (prop: FolderItemProp) => {

    const [isActiveDrag, setDragState] = useState<boolean>(false);

    const mobileAgentState = useCheckMobileAgent();


    const router = useRouter();
    const itemRef = useRef<HTMLDivElement>(null);



    //#region Event_Handler 

    const eventHandler = {
        onDragStart: (e: React.DragEvent<HTMLDivElement>) => {


            e.dataTransfer.setData('data-item-type', prop.type);
            e.dataTransfer.setData('data-uid', prop.data.uid ?? '');
            // e.dataTransfer.setDragImage(dragItemBoxRef.current!, 1, 1)
            // e.dataTransfer.setData('text/plain', JSON.stringify({type : 'test'}));
        },
        onDrop: (e: React.DragEvent<HTMLDivElement>) => {
            if (mobileAgentState.isMobile) {
                //MOBILE
                // router.push(`/explorer/${prop.type}/${prop.data.uid}`)
            }
            else {
                e.preventDefault();
                const itemType = e.dataTransfer.getData('data-item-type');
                const itemUid = e.dataTransfer.getData('data-uid');

                console.log(itemType, ':', itemUid);
                setDragState(false)

                if (itemType === 'file' && prop.type === 'folder') {
                    console.log('File to Folder');
                }
                else if (itemType === 'folder' && prop.type === 'folder') {
                    console.log('Folder to Folder');
                }
            }
        },
        onDragOver: (e: React.DragEvent<HTMLDivElement>) => {
            // console.log('over')
            setDragState(true)
            e.preventDefault(); // 필수
        },
        onDragLeave: (e: React.DragEvent<HTMLDivElement>) => {
            setDragState(false)
        },
        onContextMenu: (e: MouseEvent<HTMLDivElement>) => {
            // 마우스 오른쪽 클릭 시 Context Menu 오픈
            e.preventDefault();
            e.stopPropagation();
            prop.contextRef?.current?.setData(prop.type, prop.data);
            prop.contextRef?.current?.setState(true, {
                x: e.clientX,
                y: e.clientY
            })
        },
        onClick: (e: MouseEvent<HTMLDivElement>) => {
            if (mobileAgentState.isMobile) {
                //MOBILE
                router.push(`/explorer/${prop.type}/${prop.data.uid}`)
            }
            else {
                //PC
                if (prop.onClick) prop.onClick(e);
            }

        },
        onDoubleClick: (e: MouseEvent<HTMLDivElement>) => {
            router.push(`/explorer/${prop.type}/${prop.data.uid}`)
        },
        onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => {

        },
        onLongTouch: (e: TouchEvent<HTMLDivElement>) => {

            // e.preventDefault();
            // e.stopPropagation();

            const touchLocation = e.touches[0];

            prop.contextRef?.current?.setData(prop.type, prop.data);
            prop.contextRef?.current?.setState(true, {
                x: touchLocation?.clientX,
                y: touchLocation?.clientY
            })
        }
    }



    //#endregion Event_Handler 

    return (
        <Fragment>
            <BaseFolderItem
                className='cp-folder-item'
                data-selected={prop.isSelect}
                data-drag-active={isActiveDrag}
                data-type={prop.type}
                data-uid={prop.data.uid}
                data-shared={
                    (prop.type === 'file' && (prop.data as CrepenFile).isPublished === true)
                }
                ref={itemRef}

                draggable={!mobileAgentState.isMobile}
                onDragStart={eventHandler.onDragStart}
                onDrop={eventHandler.onDrop}
                onDragOver={eventHandler.onDragOver}
                onDragLeave={eventHandler.onDragLeave}
                onContextMenu={eventHandler.onContextMenu}
                onClick={eventHandler.onClick}
                onDoubleClick={eventHandler.onDoubleClick}
                onKeyDown={eventHandler.onKeyDown}
                onLongTouch={eventHandler.onLongTouch}

                type={prop.type}
                value={prop.value}

                icon={
                    prop.type === 'file' ?
                        MimeUtil.getCategory((prop.data as CrepenFile).fileStore?.fileType ?? '') === 'image'
                            ? faImage
                            : MimeUtil.getCategory((prop.data as CrepenFile).fileStore?.fileType ?? '') === 'video'
                                ? faVideo
                                : undefined
                        : undefined
                }
            />



        </Fragment>

    )
}


