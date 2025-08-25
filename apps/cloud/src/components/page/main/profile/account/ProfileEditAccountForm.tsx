'use client'

import { CustomInput } from "@web/component/global/control/custom-input/CustomInput"
import { AuthSessionUserDataResponse } from "@web/lib/types/api/dto/RestAuthDto"
import { useEffect } from "react"

interface ProfileEditAccountFormProp {
    userData : AuthSessionUserDataResponse | undefined
}

export const ProfileEditAccountForm = (prop : ProfileEditAccountFormProp) => {



    return (
        <div className="cp-profile-edit-form">
            <CustomInput 
                label="ID"
                defaultValue={prop.userData?.accountId}
                inputReadOnly
            />
            <CustomInput 
                label="Email"
                defaultValue={prop.userData?.email}
            />
            <CustomInput 
                label="Name"
                defaultValue={prop.userData?.name}
            />
            <CustomInput 
                label="State"
                defaultValue={prop.userData?.accountState}
                inputReadOnly
            />
            <CustomInput 
                label="Create Account Date"
                defaultValue={prop.userData?.createDate}
                inputReadOnly
            />
            <CustomInput 
                label="Update Account Date"
                defaultValue={prop.userData?.updateDate}
                inputReadOnly
            />
        </div>
    )
}