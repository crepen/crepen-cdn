'use client'

import { ExplorerNewFolderModal } from "@web/component/global/modal/explorer/new-folder-modal/ExplorerNewFolderModal"
import { useClientLocale } from "@web/lib/module/locale/ClientLocaleProvider"
import { Fragment, useRef, useState } from "react"
import { FcOpenedFolder } from "react-icons/fc"

interface ExplorerNewFolderButtonProp {
    folderUid?: string
}

export const ExplorerNewFolderButton = (prop: ExplorerNewFolderButtonProp) => {

    const translateHook = useClientLocale();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const buttonRef = useRef<HTMLButtonElement>(null)

    return prop.folderUid && (
        <Fragment>
            <button className='cp-header-bt cp-new-folder-bt'
                onClick={() => setIsOpen(!isOpen)}
                ref={buttonRef}
            >
                <div className='cp-button-icon'>
                    <FcOpenedFolder />
                </div>
                <div className='cp-button-text'>
                    {translateHook.translate('page.main.explorer.header.button.newfolder')}
                </div>
            </button>
            <ExplorerNewFolderModal
                folderUid={prop.folderUid}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                buttonRef={buttonRef}
            />
        </Fragment>
    )
}