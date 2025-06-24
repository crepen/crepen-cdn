import './detail-item.setting.folder.scss'

import { StringUtil } from "@web/lib/util/string.util"
import { PropsWithChildren } from "react"

interface DetailItemProp extends PropsWithChildren {
    title: string,
    className?: string
}

export const DetailItem = (prop: DetailItemProp) => {
    return (
        <div className={StringUtil.joinClassName('cp-detail-item' , prop.className)}>
            <div className='cp-detail-title'>
                {prop.title}
            </div>
            <div className='cp-detail-value'>
                {prop.children}
            </div>
        </div>
    )
}   