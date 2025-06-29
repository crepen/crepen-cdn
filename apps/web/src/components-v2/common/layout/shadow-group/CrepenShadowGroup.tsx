import { PropsWithChildren } from 'react'
import './CrepenShadowGroup.scss'
import { PropsWithClassName } from '@web/types/common.component'
import { StringUtil } from '@web/lib/util/string.util'

export const CrepenShadowGroup = (prop: PropsWithChildren<PropsWithClassName>) => {
    return (
        <div
            className={StringUtil.joinClassName('cp-shadow-group', prop.className)}
        >
            {prop.children}
        </div>
    )
}