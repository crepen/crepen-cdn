'use client'

import './fast-add.file.scss'
import { Fragment, MouseEvent, useState } from "react"
import { FastAddFileModal } from "./fast-add.file"
import { StringUtil } from '@web/lib/util/string.util'

interface FastAddFileModalButtonProp {
    value: string,
    folderUid?: string
}

export const FastAddFileModalButton = (prop: FastAddFileModalButtonProp) => {

    const [isModalOpen, setModalState] = useState<boolean>(false);

    const onClickEventHandler = (e: MouseEvent<HTMLButtonElement>) => {
        if (StringUtil.isEmpty(prop.folderUid)) {
            alert('폴더 정보를 찾을 수 없습니다.');
        }
        else {
            setModalState(true)
        }
    }

    return (
        <Fragment>
            <button
                className='cp-fast-add-modal-open-bt cp-button'
                onClick={onClickEventHandler}
            >
                {prop.value}
            </button>

            {
                isModalOpen === true &&
                <FastAddFileModal
                    open={isModalOpen}
                    close={() => setModalState(false)}
                    folderUid={prop.folderUid!}
                />
            }


        </Fragment>

    )
}