import { StringUtil } from "@web/lib/util/string.util"
import { PropsWithClassName } from "@web/types/common.component"
import { PropsWithChildren } from "react"

export const CommonDefaultPageContent = (prop: PropsWithChildren<PropsWithClassName>) => {
    return (
        <div className={StringUtil.joinClassName("cp-page-content" , prop.className)}>
            {prop.children}
        </div>
    )
}