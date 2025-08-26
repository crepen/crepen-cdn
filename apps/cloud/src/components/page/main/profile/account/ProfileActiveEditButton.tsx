'use client'

import { FcSettings } from "react-icons/fc"
import { MdClose, MdEdit } from "react-icons/md"
import { useProfileEdit } from "./ProfileEditProvider"

export const ProfileActiveEditButton = () => {

    const profileEditHook = useProfileEdit();

    return (
        <button 
            className="cp-active-edit-button cp-edit-common-button"
            onClick={() => {
                if(profileEditHook.isEditable){
                    profileEditHook.setEditState(false);
                    profileEditHook.onSignal('cancel-signal');
                }
                else{
                    profileEditHook.setEditState(true);
                }
            }}
        >
            <div className="cp-button-icon">
                {
                    profileEditHook.isEditable 
                    ? <MdClose size={18}/>
                    : <MdEdit size={18}/>
                }
                
            </div>
        </button>
    )
}