'use client'

import './remove-bt.file.scss'
import { faTrash } from "@fortawesome/free-solid-svg-icons"
import { CrepenIconButton } from "@web/components/control/icon-button/icon-button.control"
import { CrepenModal } from "@web/components/page/common/base-modal.common"
import { FileAction } from '@web/modules/server/action'
import { CrepenActionError } from '@web/lib/common/action-error'
import { useGlobalBasePath } from '@web/lib/state/global.state'
import { CommonUtil } from "@web/lib/util/common.util"
import { useRouter } from 'next/navigation'
import { Fragment, useState } from "react"
import urlJoin from 'url-join'

interface RemoveFileIconButtonProp {
    parentFolderUid?: string,
    fileUid?: string
}

export const RemoveFileIconButton = (prop: RemoveFileIconButtonProp) => {

    const [openModal, setModalState] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const router = useRouter();
    const basePath = useGlobalBasePath();

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
           

        // fetch(`${basePath.value}/api/file/${prop.fileUid}` ,{
        //     method : 'DELETE'
        // })
        //     .then(async (res: any) => {
        //         console.log('RRR', res);
        //         try {
        //             const data = await res.json();
        //             console.log(data);
        //         }
        //         catch (err) {
        //             console.log(err);
        //             alert('알 수 없는 오류입니다.');
        //         }


        //         // if (res.success === true) {
        //         //     router.push(urlJoin('/explorer/folder', prop.parentFolderUid ?? ''))
        //         // }
        //         // else {
        //         //     console.log(res.message);
        //         //     alert(res.message)
        //         // }
        //     })
        //     .catch(err => {
        //         console.log(err);
        //         alert('알 수 없는 오류입니다.');
        //     })
        //     .finally(() => {
        //         setIsLoading(false);
        //     })



    }

    return (
        <Fragment>
            <CrepenIconButton
                icon={faTrash}
                enableTooltip
                tooltipText='Remove file.'
                onClick={() => setModalState(true)}
                className="cp-remove-file-bt"
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
        </Fragment>

    )
}