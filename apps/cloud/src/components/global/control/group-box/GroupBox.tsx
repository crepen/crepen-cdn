import { StringUtil } from "@web/lib/util/StringUtil"
import { PropsWithChildren } from "react"

interface GroupBoxProp extends PropsWithChildren {
    className?: string,
    hidden?: boolean,
    templete?: boolean
}

export const GroupBox = (prop: GroupBoxProp) => {
    return (
        <div
            className={
                StringUtil.joinClassName(
                    "cp-group-box",
                    prop.className,
                    (prop.templete ?? false) ? 'cp-group-templete' : ''
                )
            }
            hidden={prop.hidden}
        >
            {prop.children}
        </div>
    )
}

interface GroupBoxHeaderProp {
    className?: string,
    noBottomLine? :boolean
}


export const GroupBoxHeader = (prop: PropsWithChildren<GroupBoxHeaderProp>) => {
    return (
        <div
            className={StringUtil.joinClassName(
                "cp-group-header",
                prop.className,
                prop.noBottomLine ? 'cp-no-bottom-line' : ''
            )}
        >
            {prop.children}
        </div>
    )
}

interface GroupBoxContentProp {
    className?: string
}

export const GroupBoxContent = (prop: PropsWithChildren<GroupBoxContentProp>) => {
    return (
        <div
            className={StringUtil.joinClassName(
                "cp-group-content",
                prop.className
            )}
        >
            {prop.children}
        </div>
    )
}

interface GroupBoxFooterProp {
    className?: string
}

export const GroupBoxFooter = (prop: PropsWithChildren<GroupBoxFooterProp>) => {
    return (
        <div
            className={StringUtil.joinClassName(
                "cp-group-footer",
                prop.className
            )}
        >
            {prop.children}
        </div>
    )
}

GroupBox.Header = GroupBoxHeader;
GroupBox.Content = GroupBoxContent;
GroupBox.Footer = GroupBoxFooter;