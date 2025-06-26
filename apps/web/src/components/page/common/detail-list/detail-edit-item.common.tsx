'use client'

import './detail-edit-item.common.scss'

import { Fragment, useRef, useState } from "react"
import { CrepenDetailItem } from "./detail-item.common"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit } from "@fortawesome/free-solid-svg-icons"

interface CrepenDetailEditableItemProp {
    title: string,
    value?: string,
    onSubmit?: (value? : string) => Promise<boolean>
}

export const CrepenDetailEditableItem = (prop: CrepenDetailEditableItemProp) => {

    const [isEditable, setEditState] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);

 

    return (
        <CrepenDetailItem
            title={prop.title}
            className="cp-detail-editable-item"
        >
            <div className="cp-detail-edit-box" data-editable={isEditable}>
                {
                    isEditable === true &&
                    <Fragment>
                        <input
                            type="text"
                            defaultValue={prop.value}
                            className="cp-edit-input"
                            ref={inputRef}
                        />
                        <div className='cp-edit-action'>
                            <button
                                className='cp-edit-submit-bt'
                                onClick={async () => {
                                    if(prop.onSubmit && await prop.onSubmit(inputRef.current?.value))
                                    {
                                        setEditState(false);
                                    }
                                }}
                            >
                                Save
                            </button>
                            <button
                                className='cp-edit-cancel-bt'
                                onClick={() => setEditState(false)}
                            >
                                Cancel
                            </button>
                        </div>
                        {/* <FontAwesomeIcon icon={faSave} className='cp-edit-submit-bt cp-detail-icon-bt' /> */}

                    </Fragment>
                }
                {
                    isEditable !== true &&
                    <Fragment>
                        <span className="cp-view-text">{prop.value}</span>
                        <FontAwesomeIcon
                            icon={faEdit}
                            className="cp-view-edit-bt"
                            onClick={() => setEditState(true)}
                        />
                    </Fragment>
                }
            </div>
        </CrepenDetailItem>
    )
}