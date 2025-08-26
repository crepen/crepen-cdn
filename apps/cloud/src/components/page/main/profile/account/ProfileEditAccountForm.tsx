'use client'

import { CustomInput, CustomInputErrorMessageRef } from "@web/component/global/control/custom-input/CustomInput"
import { AuthSessionUserDataResponse } from "@web/lib/types/api/dto/RestAuthDto"
import { useEffect, useRef } from "react"
import { useProfileEdit } from "./ProfileEditProvider"
import { RestUserDataValidateCheckCategory } from "@web/lib/types/api/dto/RestUserDto"
import { useClientBasePath } from "@web/lib/module/basepath/ClientBasePathProvider"
import urlJoin from "url-join"
import { useClientLocale } from "@web/lib/module/locale/ClientLocaleProvider"
import { StringUtil } from "@web/lib/util/StringUtil"
import { EditUserAction, GetSessionUserDataAction } from "@web/lib/actions/UserActions"
import { useRouter } from "next/navigation"

interface ProfileEditAccountFormProp {
    userData: AuthSessionUserDataResponse | undefined
}

export const ProfileEditAccountForm = (prop: ProfileEditAccountFormProp) => {

    const profileEditHook = useProfileEdit();
    const basePath = useClientBasePath();
    const localeHook = useClientLocale();
    const route = useRouter();

    const emailRef = useRef<HTMLInputElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);
    const updateDateRef = useRef<HTMLInputElement>(null);

    const emailErrorRef = useRef<CustomInputErrorMessageRef>(null);
    const nameErrorRef = useRef<CustomInputErrorMessageRef>(null);

    const cancelEditHandler = () => {
        if (emailRef.current) emailRef.current.value = prop.userData?.email ?? ' ';
        if (nameRef.current) nameRef.current.value = prop.userData?.name ?? ' ';
    }

    const checkValid = async (category: RestUserDataValidateCheckCategory, value: string | undefined) => {
        let isError = false;
        let message = '';

        try {
            const apiUrl = urlJoin(
                basePath.getBasePath()
                , '/api/user/add/validate',
                `?category=${category}`
            );

            const res = await window.fetch(apiUrl, {
                method: 'POST',
                body: JSON.stringify({
                    id: category === 'id' && value,
                    password: category === 'password' && value,
                    email: category === 'email' && value,
                    name: category === 'name' && value
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': localeHook.getLocale() ?? localeHook.getDefaultLocale()
                }
            })

            if (res.status === 500) {
                throw new Error();
            }

            const resData = await res.json();



            if (category === 'name') {
                if (!StringUtil.isEmpty(resData.data?.name)) {
                    nameErrorRef.current?.setError(resData.data.name);
                }
            }
            else if (category === 'email') {
                if (!StringUtil.isEmpty(resData.data?.email)) {
                    emailErrorRef.current?.setError(resData.data.email);
                }
            }

        }
        catch (e) {
            message = localeHook.translate('common.system.UNKNOWN_ERROR') ?? '';

            if (category === 'name') {
                nameErrorRef.current?.setError(message);
            }
            else if (category === 'email') {
                emailErrorRef.current?.setError(message);
            }
        }



    }

    const saveData = async () => {
        profileEditHook.setLoading(true);

        const category: RestUserDataValidateCheckCategory[] = [];
        const editData = {
            email: '',
            name: ''
        }

        category.push('email');
        editData.email = emailRef.current?.value.trim() ?? '';

        category.push('name');
        editData.name = nameRef.current?.value.trim() ?? '';



        const res = await EditUserAction(
            category,
            editData.name,
            editData.email
        )



        if (res.success) {
            profileEditHook.setEditState(false);
            await refreshUserData();
            route.refresh();
        }
        else {
            alert(res.message);
        }

        profileEditHook.setLoading(false);
    }

    const refreshUserData = async () => {
        const resData = await GetSessionUserDataAction();

        if (updateDateRef.current) updateDateRef.current.value = resData.data?.updateDate ?? '';
        if (nameRef.current) nameRef.current.value = resData.data?.name ?? '';
        if (emailRef.current) emailRef.current.value = resData.data?.email ?? '';
    }


    useEffect(() => {
        profileEditHook.addEvent('cancel-signal', cancelEditHandler);
        profileEditHook.addEvent('save-signal', saveData);

        return (() => {
            profileEditHook.removeEvent('cancel-signal', cancelEditHandler);
            profileEditHook.removeEvent('save-signal', saveData);
        })
    }, [])



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
                inputReadOnly={!profileEditHook.isEditable}
                inputRef={emailRef}
                onBlur={(evt) => checkValid('email', evt.currentTarget.value)}
                errorRef={emailErrorRef}
                onChange={() => emailErrorRef.current?.resetError()}
            />
            <CustomInput
                label="Name"
                defaultValue={prop.userData?.name}
                inputReadOnly={!profileEditHook.isEditable}
                inputRef={nameRef}
                onBlur={(evt) => checkValid('name', evt.currentTarget.value)}
                errorRef={nameErrorRef}
                onChange={() => nameErrorRef.current?.resetError()}
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
                inputRef={updateDateRef}
                inputReadOnly
            />
        </div>
    )
}