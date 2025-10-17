'use client'

import { InputGroup, InputGroupEventRef } from "@web/component/common/input-group/InputGroup"
import { SitePropertyBaseGroup, SitePropertyBaseGroupProp } from "./SitePropertyBaseGroup"
import { CommonButton } from "@web/component/common/button/CommonButton"
import { Fragment, RefObject, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { DatabaseEntity } from "@web/types/DatabaseEntity"
import { FcAbout, FcAcceptDatabase, FcDeleteDatabase, FcEditImage } from "react-icons/fc"
import { RestAdminPropertyData } from "../../../modules/server-data/RestAdminPropertyData"
import { updateDatabaseAction } from "@web/libs/action/AdminSettingAction"
import { CommonUtil } from "@web/libs/util/CommonUtil"
import { StringUtil } from "@web/libs/util/StringUtil"
import { MdDelete, MdModeEdit, MdRemove } from "react-icons/md"

interface DatabasePropertyGroupProp {
    databaseValue?: DatabaseEntity & {connectState : boolean}
}

type RefItem<T> = { key: string, ref: RefObject<T | null> };

export const DatabasePropertyGroup = (prop: SitePropertyBaseGroupProp<DatabasePropertyGroupProp>) => {


    const [isEditMode, setEditModeState] = useState<boolean>(true);

    return (
        <SitePropertyBaseGroup
            {...prop}
            className={
                StringUtil.joinClassName(
                    prop.className,
                    isEditMode ? 'cp-edit-mode' : 'cp-display-mode'
                )
            }
        >
            <SitePropertyBaseGroup.Header>
                Database
            </SitePropertyBaseGroup.Header>
            {
                isEditMode === true
                    ? <EditDatabaseContent
                        databaseValue={prop.databaseValue}
                        onCloseEdit={() => setEditModeState(false)}
                    />
                    : <DisplayDatabaseContent
                        databaseValue={prop.databaseValue}
                        onEdit={() => setEditModeState(true)}
                    />

            }

        </SitePropertyBaseGroup>
    )
}


interface EditDatabaseContentProp {
    databaseValue?: DatabaseEntity & {connectState : boolean},
    onCloseEdit : () => void
}

const EditDatabaseContent = (prop: EditDatabaseContentProp) => {
    const [isLoading, setLoadState] = useState<boolean>(false);
    const router = useRouter();


    const refList: RefItem<InputGroupEventRef>[] = [];

    const submitEventHandler = async () => {
        setLoadState(true);


        const result = await updateDatabaseAction({
            host: refList.find(x => x.key === 'host')?.ref.current?.getValue(),
            port: Number(refList.find(x => x.key === 'port')?.ref.current?.getValue()),
            username: refList.find(x => x.key === 'username')?.ref.current?.getValue(),
            password: refList.find(x => x.key === 'password')?.ref.current?.getValue(),
            database: refList.find(x => x.key === 'dbname')?.ref.current?.getValue(),
        });

        await CommonUtil.delay(1000)

        if (result.success) {
            alert(result.message);
            refList.forEach(x => x.ref.current?.reset());
            prop.onCloseEdit();
            router.refresh();
        }
        else {
            alert(result.message);
        }

        setLoadState(false);
    }

    const eventRef = (key: string) => {
        if (!refList.find(x => x.key === key)) {
            const refData: RefItem<InputGroupEventRef> = {
                key: key,
                ref: useRef<InputGroupEventRef | null>(null)
            }

            refList.push(refData);
            return refData.ref;
        }
        else {
            return refList.find(x => x.key === key)?.ref;
        }

    }


    return (
        <Fragment>
            <SitePropertyBaseGroup.Content>
                <InputGroup
                    inputId='cp-database-host'
                    disableInput={isLoading}
                    inputDefaultValue={prop.databaseValue?.host}
                    eventRef={eventRef('host')}
                >
                    Host
                </InputGroup>
                <InputGroup
                    inputId='cp-database-port'
                    disableInput={isLoading}
                    inputDefaultValue={prop.databaseValue?.port?.toString()}
                    eventRef={eventRef('port')}
                    inputType="number"
                >
                    Port
                </InputGroup>
                <InputGroup
                    inputId='cp-database-username'
                    disableInput={isLoading}
                    inputDefaultValue={prop.databaseValue?.username}
                    eventRef={eventRef('username')}
                >
                    User name
                </InputGroup>
                <InputGroup
                    inputId='cp-database-password'
                    inputType='password'
                    disableInput={isLoading}
                    inputDefaultValue={prop.databaseValue?.password}
                    inputAutoComplete="new-password "
                    eventRef={eventRef('password')}
                >
                    Password
                </InputGroup>
                <InputGroup
                    inputId='cp-database-dbname'
                    className='cp-full'
                    disableInput={isLoading}
                    inputDefaultValue={prop.databaseValue?.database}
                    eventRef={eventRef('dbname')}
                >
                    Database
                </InputGroup>
            </SitePropertyBaseGroup.Content>
            <SitePropertyBaseGroup.Footer>
                <CommonButton
                    type='secondary'
                    onClick={() => {
                        refList.forEach(x => x.ref.current?.reset());
                        // prop.onCloseEdit();
                    }}
                >
                    CANCEL
                </CommonButton>
                <CommonButton
                    type='submit'
                    isLoading={isLoading}
                    onClick={submitEventHandler}
                >
                    SUBMIT
                </CommonButton>
            </SitePropertyBaseGroup.Footer>
        </Fragment>

    )
}


interface DisplayDatabaseContentProp {
    databaseValue?: DatabaseEntity & {connectState : boolean},
    onEdit : () => void
}


const DisplayDatabaseContent = (prop: DisplayDatabaseContentProp) => {
    return (
        <Fragment>
            <SitePropertyBaseGroup.Content>
                <div className="cp-database-card">
                    <div className="cp-database-state-icon">
                        {
                            prop.databaseValue?.connectState === true
                            ? <FcAcceptDatabase size={54} />
                            : <FcDeleteDatabase size={54} />
                        }
                        
                    </div>
                    <div className="cp-database-desc">
                        <ul>
                            <li>
                                <div className="cp-desc-key">
                                    Host
                                </div>
                                <div className="cp-desc-value">
                                    {prop.databaseValue?.host}:{prop.databaseValue?.port}
                                </div>
                            </li>
                            <li>
                                <div className="cp-desc-key">
                                    User name
                                </div>
                                <div className="cp-desc-value">
                                    {prop.databaseValue?.username}
                                </div>
                            </li>
                            <li>
                                <div className="cp-desc-key">
                                    Connection
                                </div>
                                <div className="cp-desc-value">
                                    {prop.databaseValue?.connectState ? 'Success' : 'Failed'}
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="cp-database-button">
                        <CommonButton
                            type="submit"
                            onClick={() => {
                                prop.onEdit();
                            }}
                        >
                            <MdModeEdit /> Edit
                        </CommonButton>
                         <CommonButton
                            type="danger"
                        >
                            <MdDelete /> Remove
                        </CommonButton>
                    </div>
                </div>
            </SitePropertyBaseGroup.Content>
        </Fragment>
    )
}