'use client'

import { StringUtil } from "@web/lib/util/string.util"
import { PropsWithClassName } from "@web/types/common.component"
import { FormEvent, RefObject, useImperativeHandle, useRef } from "react"

interface SystemInstallDatabaseFormProp extends PropsWithClassName {
    submitButtonRef: RefObject<HTMLButtonElement | null>,
    ref: RefObject<SystemInstallDatabaseFormRef | null>,
    onSubmit: (e: FormEvent<HTMLFormElement>) => void,
    defaultValue?: {
        host?: string,
        port?: number | string,
        username?: string,
        password?: string,
        database?: string
    }
}

export interface SystemInstallDatabaseFormRef {
    submit: () => void,
    getFormData: () => FormData
}

export const SystemInstallDatabaseForm = (prop: SystemInstallDatabaseFormProp) => {

    useImperativeHandle(prop.ref, () => ({
        submit: () => {
            formRef.current?.requestSubmit();
        },
        getFormData: () => {
            const formData = new FormData();
            formData.set('host', hostInputRef.current?.value ?? '')
            formData.set('port', portInputRef.current?.value ?? '')
            formData.set('username', usernameInputRef.current?.value ?? '')
            formData.set('password', passwordInputRef.current?.value ?? '')
            formData.set('database', databaseInputRef.current?.value ?? '')

            return formData;
        }
    }))

    const formRef = useRef<HTMLFormElement>(null);

    const hostInputRef = useRef<HTMLInputElement>(null);
    const portInputRef = useRef<HTMLInputElement>(null);
    const usernameInputRef = useRef<HTMLInputElement>(null);
    const passwordInputRef = useRef<HTMLInputElement>(null);
    const databaseInputRef = useRef<HTMLInputElement>(null);



    return (
        <form
            className={StringUtil.joinClassName('cp-form', prop.className)}
            ref={formRef}
            onSubmit={prop.onSubmit}
        >
            <div className='cp-form-block'>
                <label
                    className='cp-form-label'
                    htmlFor='setup-db-host'
                >
                    Database Host
                </label>
                <input
                    className='cp-form-value cp-form-input'
                    type='text'
                    id='setup-db-host'
                    name="db-host"
                    ref={hostInputRef}
                    defaultValue={prop.defaultValue?.host}
                />
            </div>

            <div className='cp-form-block'>
                <label
                    className='cp-form-label'
                    htmlFor='setup-db-port'
                >
                    Database Port
                </label>
                <input
                    className='cp-form-value cp-form-input'
                    type='text'
                    id='setup-db-port'
                    name="db-port"
                    ref={portInputRef}
                    defaultValue={prop.defaultValue?.port?.toString()}
                />
            </div>

            <div className='cp-form-block'>
                <label
                    className='cp-form-label'
                    htmlFor='setup-db-username'
                >
                    Database Username
                </label>
                <input
                    className='cp-form-value cp-form-input'
                    type='text'
                    id='setup-db-username'
                    name="db-username"
                    ref={usernameInputRef}
                    defaultValue={prop.defaultValue?.username}
                />
            </div>

            <div className='cp-form-block'>
                <label
                    className='cp-form-label'
                    htmlFor='setup-db-password'
                >
                    Database Password
                </label>
                <input
                    className='cp-form-value cp-form-input'
                    type='password'
                    id='setup-db-password'
                    name="db-password"
                    ref={passwordInputRef}
                    defaultValue={prop.defaultValue?.password}
                />
            </div>

            <div className='cp-form-block'>
                <label
                    className='cp-form-label'
                    htmlFor='setup-db-database'
                >
                    Database name
                </label>
                <input
                    className='cp-form-value cp-form-input'
                    type='text'
                    id='setup-db-database'
                    name="db-database"
                    ref={databaseInputRef}
                    defaultValue={prop.defaultValue?.database}
                />
            </div>
        </form>
    )
}