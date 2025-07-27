import { PropsWithChildren } from 'react'
import './detail-item.common.scss'
import { StringUtil } from '@web/lib/util/string.util'

interface CrepenDetailItemProp extends PropsWithChildren {
    title : string,
    className? : string
}


export const CrepenDetailItem = (prop : CrepenDetailItemProp) => {
    return (
        <div className={StringUtil.joinClassName("cp-detail-item" , prop.className)}>
            <div className='cp-detail-title'>
                {prop.title}
            </div>
            <div className='cp-detail-value'>
                {prop.children}
            </div>
        </div>
    )
}