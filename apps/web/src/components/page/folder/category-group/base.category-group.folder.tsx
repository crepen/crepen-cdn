'use client'

import { PropsWithChildren, useState } from 'react'
import './base.category-group.folder.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp, faExpand } from '@fortawesome/free-solid-svg-icons'
import { StringUtil } from '@web/lib/util/string.util'
import { CrepenIconButton } from '@web/components/control/icon-button/icon-button.control'

interface FolderCategoryGroupProp extends PropsWithChildren {
    title: string,
    actions?: React.ReactNode,
    className? : string
}

export const FolderCategoryExpandGroup = (prop: FolderCategoryGroupProp) => {

    const [isExpand, setExpandState] = useState<boolean>(true);

    return (
        <div className={StringUtil.joinClassName('cp-category-group' , prop.className)}>
            <div
                className="cp-category-header"
            >
                <span className="cp-category-title">
                    {prop.title}
                </span>
                <div className="cp-category-action">
                    {prop.actions}
                    <CrepenIconButton 
                        icon={isExpand ? faChevronUp : faChevronDown}
                        className='cp-expand-icon'
                        onClick={() => setExpandState(!isExpand)}
                    />
                    {/* <FontAwesomeIcon
                        icon={isExpand ? faChevronUp : faChevronDown}
                        className='cp-expand-icon'
                        onClick={() => setExpandState(!isExpand)}
                    /> */}

                </div>
            </div>
            {
                isExpand &&
                <div className="cp-category-content">
                    {prop.children}
                </div>
            }

        </div>
    )
}