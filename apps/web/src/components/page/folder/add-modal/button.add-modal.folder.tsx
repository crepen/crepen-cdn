'use client'

import './button.add-modal.folder.scss'
import { useRouter } from "next/navigation"
import { Fragment, useState } from "react"
import { AddFolderModal } from "./modal.add-modal.folder";
import { StringUtil } from "@web/lib/util/string.util";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CrepenIconButton } from '@web/components/control/icon-button/icon-button.control';

interface AddFolderModalButtonProp {
    folderUid?: string
}

export const AddFolderModalButton = (prop: AddFolderModalButtonProp) => {

    const router = useRouter();

    const [isOpenModal, setModalState] = useState<boolean>(false);

    const onModalCloseEventHandler = (isEdit: boolean) => {
        setModalState(false);

        if (isEdit) {
            router.refresh();
        }
    }

    return (
        <Fragment>
            <CrepenIconButton
                icon={faAdd}
                 className="cp-folder-action-bt cp-add-folder-bt"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setModalState(true);
                }}
            />
            


            {
                (isOpenModal && !StringUtil.isEmpty(prop.folderUid)) &&
                <AddFolderModal
                    close={onModalCloseEventHandler}
                    isOpen={isOpenModal}
                    targetFolderUid={prop.folderUid!}
                />
            }
        </Fragment>

    )
}