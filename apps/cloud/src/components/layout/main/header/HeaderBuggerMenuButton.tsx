'use client'

import { FcCloseUpMode, FcMenu } from "react-icons/fc"
import { useMainAsideState } from "../provider/MainAsideStateProvider"
import { MdMenu, MdMenuOpen, MdOutlineClose } from "react-icons/md";

export const HeaderBuggerMenuButton = () => {

    const asideStateHook = useMainAsideState();

    return (
        <button className="cp-menu-button"
            onClick={() => {
                asideStateHook.toggle();
            }}
        >
            {
                asideStateHook.state
                ? <MdOutlineClose className="cp-button-icon" size={28} />
                : <MdMenuOpen className="cp-button-icon" size={28} />
            }
        </button>
    )
}