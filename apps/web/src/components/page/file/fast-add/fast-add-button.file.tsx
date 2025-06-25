'use client'

import './fast-add.file.scss'
import { Fragment, MouseEvent, useState } from "react"
import { FastAddFileModal } from "./fast-add.file"
import { StringUtil } from '@web/lib/util/string.util'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd } from '@fortawesome/free-solid-svg-icons'
import { CrepenIconButton } from '@web/components/control/icon-button/icon-button.control'

interface FastAddFileModalButtonProp {
    // value: string,
    folderUid?: string
}

export const FastAddFileModalButton = (prop: FastAddFileModalButtonProp) => {

    const router = useRouter();
    const [isModalOpen, setModalState] = useState<boolean>(false);

    const onClickEventHandler = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (StringUtil.isEmpty(prop.folderUid)) {
            alert('폴더 정보를 찾을 수 없습니다.');
        }
        else {
            setModalState(true)
        }
    }

    const onCloseModalEventHandler = (isEdit: boolean) => {
        setModalState(false)
        if (isEdit) {
            router.refresh();
        }
    }

    return (
        <Fragment>
            <CrepenIconButton
                icon={faAdd}
                className='cp-fast-add-modal-open-bt cp-button'
                onClick={onClickEventHandler}
            />

            {/* <button

                onClick={onClickEventHandler}
            >
                {prop.value}
            </button> */}

            {
                isModalOpen === true &&
                <FastAddFileModal
                    open={isModalOpen}
                    close={onCloseModalEventHandler}
                    folderUid={prop.folderUid!}
                />
            }


        </Fragment>

    )
}