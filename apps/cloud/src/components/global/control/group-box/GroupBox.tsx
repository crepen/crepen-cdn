import { StringUtil } from "@web/lib/util/StringUtil"
import { PropsWithChildren } from "react"

interface GroupBoxProp extends PropsWithChildren {
    className?: string,
    hidden?: boolean
}

export const GroupBox = (prop: GroupBoxProp) => {
    return (
        <div
            className={StringUtil.joinClassName("cp-group-box", prop.className)}
            hidden={prop.hidden}
        >
            {prop.children}
        </div>
    )
}