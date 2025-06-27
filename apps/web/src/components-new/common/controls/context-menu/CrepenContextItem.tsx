import { MouseEvent, PropsWithChildren } from 'react'
import './CrepenContextItem.scss'
import { StringUtil } from '@web/lib/util/string.util'

interface CrepenContextItemProp extends PropsWithChildren {
    onClick?: (e: MouseEvent<HTMLDivElement>) => void,
    className?: string
}

export const CrepenContextItem = (prop: CrepenContextItemProp) => {

    return (
        <div
            className={StringUtil.joinClassName("cp-context-item" , prop.className)}
            onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
            onClick={(e) => {
                if (prop.onClick) prop.onClick(e);
            }}
        >
            {prop.children}
        </div>
    )
}