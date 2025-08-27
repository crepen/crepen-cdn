import { StringUtil } from "@web/lib/util/StringUtil"
import { PropsWithChildren } from "react"

interface CommonPageProp {
    className?: string,
    fixed?: boolean
}

export const CommonPage = (prop: PropsWithChildren<CommonPageProp>) => {
    return (
        <div className={
            StringUtil.joinClassName(
                "cp-page",
                prop.fixed ? 'cp-fixed-page' : '',
                prop.className
            )
        }>
            {prop.children}
        </div>
    )
}

interface CommonPageWrapperProp {
    size?: 'full' | 'xl' | 'l' | 'm' | 's' | 'xs' | 'min',
    template? : boolean,
    noPadding? : boolean
}


const CommonPageWrapper = (prop: PropsWithChildren<CommonPageWrapperProp>) => {
    return (
        <div
            className={
                StringUtil.joinClassName(
                    'cp-page-wrapper',
                    `cp-size-${prop.size ?? 'full'}`,
                    prop.template ? 'cp-fix-container' : '',
                    prop.noPadding ? 'cp-no-padding' : ''
                )
            }
        >
            {prop.children}
        </div>
    )
}


const CommonPageHeader = (prop: PropsWithChildren) => {
    return (
        <div className="cp-page-header">
            {prop.children}
        </div>
    )
}

const CommonPageContent = (prop: PropsWithChildren) => {
    return (
        <div className="cp-page-content">
            {prop.children}
        </div>
    )
}


const CommonPageFooter = (prop: PropsWithChildren) => {
    return (
        <div className="cp-page-footer">
            {prop.children}
        </div>
    )
}



CommonPage.Header = CommonPageHeader;
CommonPage.Content = CommonPageContent;
CommonPage.Footer = CommonPageFooter;
CommonPage.Wrapper = CommonPageWrapper;