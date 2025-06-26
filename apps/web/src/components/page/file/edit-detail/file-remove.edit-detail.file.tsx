'use client'

import './file-remove.edit-detail.file.scss'

import { faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { CrepenDetailItem } from "../../common/detail-list/detail-item.common"
import { FileAction } from '@web/lib/action'
import { useState } from 'react'
import urlJoin from 'url-join'
import { CrepenModal } from '../../common/base-modal.common'
import { useRouter } from 'next/navigation'

interface FileRemoveEditDetailItemProp {
    title: string,
    fileUid?: string,
    parentFolderUid?: string
}

export const FileRemoveEditDetailItem = (prop: FileRemoveEditDetailItemProp) => {
    const [openModal, setModalState] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const router = useRouter();
    const onSubmitEventHandler = () => {
        setIsLoading(true);



        FileAction.removeFile(prop.fileUid)
            .then(async (res) => {
                if (res.success === true) {
                    router.push(urlJoin('/explorer/folder', prop.parentFolderUid ?? ''))
                }
                else {
                    console.log(res.message);
                    alert(res.message)
                    setIsLoading(false);
                }
            })
            .catch(err => {
                console.log(err);
                alert('알 수 없는 오류입니다.');
                setIsLoading(false);
            })



    }


    return (
        <CrepenDetailItem
            title={prop.title}
            className="cp-file-remove-edit-detail-item"
        >
            <FontAwesomeIcon
                icon={faTrash}
                className="cp-file-remove-bt"
                onClick={() => setModalState(true)}
            />

            {
                openModal &&
                <CrepenModal
                    close={() => setModalState(false)}
                    isOpen={openModal}
                    headerOptions={{
                        title: 'Remove File',
                        enableCloseButton: false
                    }}
                    footerOptions={{
                        enableCloseButton: true,
                        enableSubmitButton: true,
                        isLoadingSubmitButton: isLoading,
                        submit: onSubmitEventHandler
                    }}
                    className="cp-remove-file-modal"
                    modalBoxClassName='cp-remove-file-modal-box'
                >
                    정말로 삭제하시겠습니까?
                </CrepenModal>
            }
        </CrepenDetailItem>
    )
}