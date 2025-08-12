import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { StringUtil } from "@web/lib/util/StringUtil"
import { ReactNode } from "react"

interface SignInActionButtonProp {
    render?: ReactNode,
    icon?: IconProp,
    className?: string
}

export const SignInActionButton = (prop: SignInActionButtonProp) => {
    return (
        <button className={StringUtil.joinClassName("cp-signin-action-bt" , prop.className)}>
            {
                prop.render
                    ? prop.render
                    : prop.icon
                        ? <FontAwesomeIcon icon={prop.icon} />
                        : undefined

            }
        </button>
    )
}