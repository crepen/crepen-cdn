'use client'

import './group-box.common.scss';

import { PropsWithChildren, useState } from "react"
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { StringUtil } from '@web/lib/util/string.util';
import { CrepenIconButton } from '../../../../component/common/icon-button/icon-button.control';

interface GroupExpandBoxProp extends PropsWithChildren {
    title?: string,
    defaultOpen?: boolean,
    className?: string,
    hideTitle? : boolean,
    contentBoxClassName? : string
}

export const GroupExpandBox = (prop: GroupExpandBoxProp) => {

    const [isOpen, setOpenState] = useState<boolean>(prop.hideTitle === true ? true : (prop.defaultOpen ?? false));

    return (
        <div
            className={StringUtil.joinClassName('cp-group-expand-box', prop.className)}
            data-expand={isOpen}
            data-hide-title={prop.hideTitle ?? false}
        >
            <div className='cp-group-header'>
                <div className='cp-group-title'>
                    {prop.title}
                </div>
                <div className='cp-group-action'>
                    <CrepenIconButton 
                        icon={isOpen ? faAngleUp : faAngleDown}
                        onClick={() => setOpenState(!isOpen)}
                    />
                </div>

            </div>
            <div className={StringUtil.joinClassName('cp-group-content' , prop.contentBoxClassName)}>
                {prop.children}
            </div>
        </div>
    )
}