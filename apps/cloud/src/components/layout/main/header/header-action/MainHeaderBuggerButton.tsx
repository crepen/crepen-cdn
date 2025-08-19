'use client'

import { MdMenuOpen, MdOutlineClose } from "react-icons/md";
import { useMainAsideState } from "../../provider/MainAsideStateProvider";
import { MainHeaderActionButton } from "./MainHeaderActionButton";
import { useEffect, useRef } from "react";
import { StringUtil } from "@web/lib/util/StringUtil";

export const MainHeaderBuggerButton = () => {

    const asideStateHook = useMainAsideState();


    return (
        <MainHeaderActionButton
            className={StringUtil.joinClassName("cp-side-menu-bt" , asideStateHook.state ? 'active' : "")}
            icon={
                asideStateHook.state
                    ? <MdOutlineClose className="cp-button-icon" size={20} />
                    : <MdMenuOpen className="cp-button-icon" size={20} />
            }
            text="Upload Monitor"
            mode="only-icon"
            onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                asideStateHook.toggle();
            }}
            // ref={buttonRef}
        />
    )
}