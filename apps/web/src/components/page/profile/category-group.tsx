'use client'

import { StringUtil } from "@web/lib/util/string.util";
import { PropsWithChildren, useState } from "react"

interface ProfileCategoryGroupProp extends PropsWithChildren{
    className? : string
}

export const ProfileCategoryGroup = (prop : ProfileCategoryGroupProp) => {

    const [isOpen , setOpenState] = useState<boolean>(false);

    const openCategoryHandler = () => {
        setOpenState(!isOpen);
    }

    return (
        <div className={StringUtil.joinClassName('cp-profile-category' , prop.className)}>
            <div className='cp-category-expand' onClick={openCategoryHandler}>
                Change Password
            </div>
            <div className='cp-category-context' data-expand={isOpen ? 'true' : 'false'}>
               {prop.children}
            </div>
        </div>
    )
}