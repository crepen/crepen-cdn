import './CommonDefaultPageContainer.scss'

import { StringUtil } from "@web/lib/util/string.util"
import React, { PropsWithChildren } from "react"

interface CommonDefaultPageContainerProp extends PropsWithChildren {
    className?: string,
    title?: string | React.ReactNode
}

export const CommonDefaultPageContainer = (prop: CommonDefaultPageContainerProp) => {
    return (
        <div className={StringUtil.joinClassName("cp-common-page", prop.className)}>
            <div className="cp-page-header">
                {
                    prop.title &&
                    <div className="cp-page-title">
                        <span>{prop.title}</span>
                    </div>
                }

            </div>
            <div className="cp-page-content">
                {prop.children}
            </div>
        </div>
    )
}