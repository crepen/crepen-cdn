import { StringUtil } from "@web/lib/util/StringUtil";
import { PropsWithChildren } from "react";

interface CommonLayoutProp {
    className?: string
}

export const CommonLayout = (prop: PropsWithChildren<CommonLayoutProp>) => {
    return (
        <div className={StringUtil.joinClassName("cp-layout" , prop.className)}>
            {prop.children}
        </div>
    )
}