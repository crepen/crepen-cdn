'use client'

import { BaseHeaderIconButton } from "../icon-button/base.icon-button.header.main"
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import { StringUtil } from "@web/lib/util/string.util"
import { Fragment, useState } from "react"
import { HeaderSearchModal } from "./search.modal.header.main"

interface SearchHeaderIconButtonProp {
    className?: string
}

export const SearchHeaderIconButton = (prop: SearchHeaderIconButtonProp) => {

    const [isOpenModal, setModalState] = useState<boolean>(false);


    return (
        <Fragment>
            <BaseHeaderIconButton
                icon={faSearch}
                className={StringUtil.joinClassName(prop.className, 'cp-search-bt')}
                onClick={() => setModalState(true)}
            />
            {
                isOpenModal === true &&
                <HeaderSearchModal
                    isOpen={isOpenModal}
                    close={() => setModalState(false)}
                />
            }

        </Fragment>
    )
}