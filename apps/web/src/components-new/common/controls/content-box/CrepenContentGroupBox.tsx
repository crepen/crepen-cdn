import { PropsWithChildren } from 'react'
import './CrepenContentGroupBox.scss'
import { PropsWithClassName } from '@web/types/common.component'
import { StringUtil } from '@web/lib/util/string.util'

export const CrepenContentGroupBox = (prop : PropsWithChildren<PropsWithClassName>) => {
    return (
        <div className={StringUtil.joinClassName("cp-content-group-box" , prop.className)}>
            {prop.children}
        </div>
    )
}