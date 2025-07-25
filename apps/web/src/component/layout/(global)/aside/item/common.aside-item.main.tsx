import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { StringUtil } from "@web/lib/util/string.util"
import { DOMAttributes, MouseEvent, MouseEventHandler } from "react"

interface MainAsideMenuItemProp {
    title: string,
    icon: IconProp,
    onClick?: MouseEventHandler<HTMLDivElement>
    className? : string
}

export const MainAsideMenuItem = (prop: MainAsideMenuItemProp) => {

    const divOptions: DOMAttributes<HTMLDivElement> = {}

    if (prop.onClick !== undefined) {
        divOptions.onClick = (e) => prop.onClick!(e);
    }

    return (
        <div  {...divOptions} className={StringUtil.joinClassName('cp-aside-item cp-item-common' , prop.className)}>
            <FontAwesomeIcon icon={prop.icon} className='cp-item-icon' />
            <span className='cp-item-title'>{prop.title}</span>
        </div>
    )
}



