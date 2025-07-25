import { PropsWithClassName } from '@web/modules/common/type/common.component'
import './ProfileMenu.scss'
import { CrepenShadowGroup } from '@web/components-v2/common/layout/shadow-group/CrepenShadowGroup'
import Link from 'next/link'

interface ProfileMenuProp extends PropsWithClassName {
    activeMenu: string
}

interface ProfileMenuItemProp {
    name: string,
    category: string
}

export const ProfileMenu = (prop: ProfileMenuProp) => {


    const menuList: ProfileMenuItemProp[] = [
        {
            name: 'User',
            category: 'user'
        },
        {
            name: 'Password',
            category: 'password'
        }
    ]


    return (
        <div className='cp-profile-menu'>
            {
                menuList.map((item , idx) => (
                    <Link
                        href={`/profile/${item.category}`}
                        key={idx}
                        className='cp-menu-item'
                        data-selected={prop.activeMenu === item.category}
                    >
                        {item.name}
                    </Link>
                ))
            }
        </div>
    )
}