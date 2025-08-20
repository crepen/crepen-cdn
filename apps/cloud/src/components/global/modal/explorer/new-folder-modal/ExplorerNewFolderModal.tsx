'use client'

import { StringUtil } from "@web/lib/util/StringUtil"
import { CommonModal, CommonModalProp } from "../../common/CommonModal"
import { useClientLocale } from "@web/lib/module/locale/ClientLocaleProvider"
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react"
import { CommonUtil } from "@web/lib/util/CommonUtil"
import { AddFolderAction } from "@web/lib/actions/FolderActions"
import { useRouter } from "next/navigation"

interface ExplorerNewFolderModalProp extends CommonModalProp {
    folderUid?: string,
}

const MAX_VALUE_LENGTH = 50;

export const ExplorerNewFolderModal = (prop: ExplorerNewFolderModalProp) => {

    const [inputValueSize, setInputValueSize] = useState<number>(0);
    const translateHook = useClientLocale();
    const [isSaveLoading, setSaveLoadState] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();


    const applyFolder = async () => {
        setSaveLoadState(true);

        if (!inputRef.current?.value) {
            alert(translateHook.translate('page.main.explorer.modal.new-folder.empty-warning'))
        }
        else {
            const result = await AddFolderAction(prop.folderUid ?? 'NTF', inputRef.current.value);

            if (!result.success) {
                alert(result.message);
            }
            else {
                router.refresh();
                if (prop.onClose) prop.onClose();
            }

        }
        setSaveLoadState(false);
    }

    useEffect(() => {
        if (prop.isOpen) {
            setInputValueSize(0)
        }
    }, [prop.isOpen])

    return prop.folderUid && (
        <CommonModal
            className={StringUtil.joinClassName("cp-explorer-new-folder-modal", prop.className)}
            isOpen={prop.isOpen}
            onClose={prop.onClose}
            buttonRef={prop.buttonRef}
        >
            <CommonModal.Header>
                <div className="cp-header-title">
                    {translateHook.translate('page.main.explorer.modal.new-folder.header')}
                </div>
            </CommonModal.Header>
            <CommonModal.Content>
                <div className="cp-input-label">
                    <label htmlFor="new-folder-input">Folder name</label>
                    <label
                        className={StringUtil.joinClassName((inputValueSize > MAX_VALUE_LENGTH || inputValueSize < 1) ? "cp-overflow" : '')}
                        htmlFor="new-folder-input"
                    >
                        {inputValueSize}/50
                    </label>
                </div>

                <input
                    type="text"
                    className="cp-new-folder-input"
                    id="new-folder-input"
                    ref={inputRef}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        setInputValueSize(StringUtil.getByteLength(event.currentTarget?.value.trim() ?? ''))
                    }}
                />
            </CommonModal.Content>
            <CommonModal.Footer>
                <button onClick={prop.onClose}>
                    {translateHook.translate('page.main.explorer.modal.new-folder.close')}
                </button>
                <button
                    className={StringUtil.joinClassName("cp-active-bt", isSaveLoading ? 'cp-loading' : '')}
                    disabled={inputValueSize > MAX_VALUE_LENGTH || inputValueSize < 1}
                    onClick={() => !isSaveLoading && applyFolder()}
                >
                    <span className="cp-button-text">Save</span>
                    <div className="cp-loader">
                        <div className="cp-loader-dot" />
                        <div className="cp-loader-dot" />
                        <div className="cp-loader-dot" />
                    </div>
                </button>
            </CommonModal.Footer>
        </CommonModal>
    )
}