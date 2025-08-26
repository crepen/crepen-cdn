'use client'

import { RiSave3Fill } from "react-icons/ri"
import { useProfileEdit } from "./ProfileEditProvider";
import { AiOutlineLoading } from "react-icons/ai";
import { StringUtil } from "@web/lib/util/StringUtil";

export const ProfileSaveEditButton = () => {

    const profileEditHook = useProfileEdit();

    return profileEditHook.isEditable && (
        <button
            className="cp-save-edit-button cp-edit-common-button"
            onClick={() => {
                if(!profileEditHook.isLoading){
                    profileEditHook.onSignal('save-signal');
                }
            }}
        >
            <div className={StringUtil.joinClassName("cp-button-icon" , profileEditHook.isLoading ? 'cp-loading' : '')}>
                {
                    profileEditHook.isLoading
                    ? <AiOutlineLoading size={18} />
                    : <RiSave3Fill size={18} />
                }
                
            </div>
        </button>
    )
}