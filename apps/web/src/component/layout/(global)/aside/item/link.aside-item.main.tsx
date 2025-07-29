import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { CustomLink } from "@web/component/common/custom-link/CustomLink"
import Link from "next/link"

interface MainAsideMenuLinkItemProp {
    link?: string,
    title: string,
    icon: IconProp
}

export const MainAsideMenuLinkItem = (prop: MainAsideMenuLinkItemProp) => {
    return (
        <CustomLink className='cp-aside-item cp-item-link' href={prop.link ?? '#'}>
            <FontAwesomeIcon icon={prop.icon} className='cp-item-icon' />
            <span className='cp-item-title'>{prop.title}</span>
        </CustomLink>
    )
}