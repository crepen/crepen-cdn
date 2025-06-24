'use client'


import './edit.detail-item.setting.folder.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { DetailItem } from "./detail-item.setting.folder"
import { faEdit } from "@fortawesome/free-regular-svg-icons"
import { Fragment, useEffect, useRef, useState } from "react"

interface EditDetialItemProp {
    title: string,
    value?: string,
    onEdit: (value?: string) => boolean | Promise<boolean>
}

export const EditDetialItem = (prop: EditDetialItemProp) => {

    const [isEditMode, setEditMode] = useState<boolean>(false);


    return (
        <DetailItem
            title={prop.title}
            className='cp-edit-detail-item'
        >
            {
                isEditMode === false
                    ? <ViewModeDetail value={prop.value} setEditMode={() => setEditMode(true)} />
                    : <EditModeDetail
                        value={prop.value}
                        onEdit={(value?: string) => {
                            if(prop.onEdit(value)){
                                setEditMode(false);
                            }
                        }}
                    />
            }

        </DetailItem>
    )
}

interface ViewModeDetailProp {
    value?: string,
    setEditMode: () => void
}

const ViewModeDetail = (prop: ViewModeDetailProp) => {
    return (
        <div className='cp-detail-view'>
            <span>{prop.value ?? ''}</span>
            <div className="cp-detail-action">
                <FontAwesomeIcon icon={faEdit} onClick={prop.setEditMode} className='cp-edit-icon' />
            </div>
        </div>
    )
}

interface EditModeDetailProp {
    value?: string,
    onEdit: (value?: string) => void
}

const EditModeDetail = (prop: EditModeDetailProp) => {

    const inputRef = useRef<HTMLInputElement>(null);

    const onSaveEventHandler = () => {
        const editFolderTitle = inputRef.current?.value;
        prop.onEdit(editFolderTitle)
    }

    useEffect(() => {
        inputRef.current?.focus();
    }, [])

    return (
        <div className='cp-edit-view'>
            <input type="text" defaultValue={prop.value ?? ''} ref={inputRef} />
            <div className="cp-detail-action">
                <button onClick={onSaveEventHandler}>Save</button>
            </div>
        </div>
    )
}