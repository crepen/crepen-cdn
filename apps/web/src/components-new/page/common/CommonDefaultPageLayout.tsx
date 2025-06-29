import './CommonDefaultPageLayout.scss'

import { StringUtil } from "@web/lib/util/string.util"
import { PropsWithClassName } from '@web/types/common.component'
import React, { PropsWithChildren } from "react"

export const CommonDefaultPageLayout = (prop: PropsWithChildren<PropsWithClassName>) => {
    return (
        <div className={StringUtil.joinClassName("cp-common-page", prop.className)}>
            {prop.children}
        </div>
    )
}