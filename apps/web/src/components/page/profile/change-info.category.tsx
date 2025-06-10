'use client'

import { CrepenUser } from "@web/services/types/user.object";
import { ProfileCategoryGroup } from "./category-group";
import { useEffect } from "react";

interface ProfileChangeInfoCategoryProp {
    userData?: CrepenUser
}

export const ProfileChangeInfoCategory = (prop: ProfileChangeInfoCategoryProp) => {

    useEffect(() => {
        console.log('USR_DT_1', prop.userData)
    }, [])

    return (
        <ProfileCategoryGroup
            className='cp-change-info'
            title="Change Info"
        >
            {
                prop.userData !== undefined
                    ? < UserDataLoadFailBox />
                    : <div></div>
            }
        </ProfileCategoryGroup>
    )
}

const UserDataLoadFailBox = () => {
    return (
        <div className="cp-error-box">
            User data load failed
        </div>
    )
}