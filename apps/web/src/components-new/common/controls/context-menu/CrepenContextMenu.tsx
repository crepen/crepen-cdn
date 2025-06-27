'use client'

import { PropsWithChildren, RefObject, useEffect, useImperativeHandle, useRef, useState } from 'react'
import './CrepenContextMenu.scss'
import { useCheckMobileAgent } from '@web/lib/hook/useCheckMobileAgent'

interface CrepenContextMenuProp extends PropsWithChildren {
    // isOpen: boolean,
    // position: { x?: number, y?: number },
    // ref?: RefObject<HTMLDivElement | null>
    itemRef?: RefObject<CrepenContextMenuRef | null>
}


export interface CrepenContextMenuRef {
    setState: (openState: boolean, position?: { x?: number, y?: number }) => void
}

const CONTEXT_MENU_INIT_POSTION: { x: number, y: number } = { x: -9999, y: -9999 };

export const CrepenContextMenu = (prop: CrepenContextMenuProp) => {

    const agentState = useCheckMobileAgent();

    const baseContextRef = useRef<HTMLDivElement>(null);
    const [isMenuOpen, setMenuState] = useState<boolean>(false);
    const [position, setPosition] = useState<{ x?: number, y?: number }>({});

    useImperativeHandle(prop.itemRef, () => ({
        setState: (isOpen: boolean, position?: { x?: number, y?: number }) => {

            const positionObj = position ?? CONTEXT_MENU_INIT_POSTION;

            if (isOpen) {

                positionObj.x = position?.x ?? CONTEXT_MENU_INIT_POSTION.x;
                positionObj.y = position?.y ?? CONTEXT_MENU_INIT_POSTION.y;

                const contextMenuWidth = baseContextRef.current?.offsetWidth ?? 0;
                const contextMenuHeight = baseContextRef.current?.offsetHeight ?? 0;

                if (window.innerWidth - (positionObj.x! + contextMenuWidth + 20) < 0) {
                    positionObj.x = positionObj.x! - contextMenuWidth - 3;
                }
                else {
                    positionObj.x = positionObj.x! + 3
                }

                if (window.innerHeight - (positionObj.y! + contextMenuHeight + 10) < 0) {
                    positionObj.y = window.innerHeight - contextMenuHeight - 10 + 3;
                }
                else {
                    positionObj.y = positionObj.y + 3
                }
            }
            else {
                positionObj.x = CONTEXT_MENU_INIT_POSTION.x;
                positionObj.y = CONTEXT_MENU_INIT_POSTION.y;
            }


            setMenuState(isOpen);
            setPosition(positionObj);
        },
    }))





    const leaveContextMenu = (target: Node) => {
        if (baseContextRef.current && !baseContextRef.current.contains(target)) {
            setMenuState(false);
            setPosition(CONTEXT_MENU_INIT_POSTION)
        }
    }

    useEffect(() => {
        return (() => {
            window.removeEventListener('click', (e) => leaveContextMenu(e.target as Node));
            if (agentState.isMobile) {
                window.removeEventListener('touchstart', (e) => leaveContextMenu(e.target as Node));
            }
        })
    }, [])

    useEffect(() => {
        if (isMenuOpen) {
            window.addEventListener('click', (e) => leaveContextMenu(e.target as Node))
            if (agentState.isMobile) {
                window.addEventListener('touchstart', (e) => leaveContextMenu(e.target as Node));
            }
        }
        else {
            window.removeEventListener('click', (e) => leaveContextMenu(e.target as Node));
            if (agentState.isMobile) {
                window.removeEventListener('touchstart', (e) => leaveContextMenu(e.target as Node));
            }
        }
    }, [isMenuOpen])

    return (
        <div
            className="cp-context-menu"
            data-state={isMenuOpen ? 'open' : 'close'}
            style={{
                top: position.y,
                left: position.x
            }}
            ref={baseContextRef}
            onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
        >
            {prop.children}
        </div>
    )
}