import { StringUtil } from "@web/lib/util/string.util"
import Link from "next/link"


interface BaseLinkButtonProp {
    link: string,
    className?: string,
    value: string
}


export const BaseLinkButton = (prop: BaseLinkButtonProp) => {
    return (
        <Link
            href={prop.link ?? '#'}
            passHref={true}
            className={StringUtil.joinClassName('cp-link-bt', prop.className)}
        >
            <button>
                <span className="cp-link-value-span">{prop.value}</span>
            </button>
        </Link>
    )
}