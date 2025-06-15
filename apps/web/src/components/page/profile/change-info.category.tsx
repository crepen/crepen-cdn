'use client'

import { CrepenUser } from "@web/services/types/object/user.object";
import { ProfileCategoryGroup } from "./category-group";

interface ProfileChangeInfoCategoryProp {
    userData?: CrepenUser
}

export const ProfileChangeInfoCategory = (prop: ProfileChangeInfoCategoryProp) => {


    return (
        <ProfileCategoryGroup
            className='cp-change-info'
            title="Change Info"
        >
            {
                prop.userData === undefined
                    ? < UserDataLoadFailBox />
                    : <div>Name : {prop.userData.name}</div>
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