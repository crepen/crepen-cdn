import { PropsWithChildren } from "react"
import { StringUtil } from "../../../libs/util/StringUtil"

export type SitePropertyBaseGroupProp<T = unknown> = T & {
    className?: string,
    isHidden?: boolean,
}

export const SitePropertyBaseGroup = (prop: PropsWithChildren<SitePropertyBaseGroupProp>) => {
    return (prop.isHidden ?? false) === false && (
        <div
            className={
                StringUtil.joinClassName(
                    "cp-group-section",
                    prop.className
                )
            }
        >
            {prop.children}
        </div>
    )
}

interface SitePropertyGroupHeaderProp {

}

const SitePropertyGroupHeader = (prop: PropsWithChildren<SitePropertyGroupHeaderProp>) => {
    return (
        <div className="cp-group-header">
            {prop.children}
        </div>
    )
}


SitePropertyBaseGroup.Header = SitePropertyGroupHeader;


const SitePropertyGroupContent = (prop: PropsWithChildren) => {
    return (
        <div className="cp-group-content">
            {prop.children}
        </div>
    )
}


SitePropertyBaseGroup.Content = SitePropertyGroupContent;



const SitePropertyGroupFooter = (prop: PropsWithChildren) => {
    return (
        <div className="cp-group-footer">
            {prop.children}
        </div>
    )
}


SitePropertyBaseGroup.Footer = SitePropertyGroupFooter;