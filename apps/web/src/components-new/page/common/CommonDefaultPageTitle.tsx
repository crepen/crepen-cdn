import { StringUtil } from "@web/lib/util/string.util"
import { PropsWithClassName } from "@web/types/common.component"
import { PropsWithChildren } from "react"

interface CommonDefaultPageTitleProp extends PropsWithChildren<PropsWithClassName> {
    title?: string
}

export const CommonDefaultPageTitle = (prop: CommonDefaultPageTitleProp) => {
    return (
        <div className={StringUtil.joinClassName("cp-page-title", prop.className)}>
            {
                prop.title !== undefined ? prop.title : prop.children
            }
        </div>
    )
}