import { PropsWithClassName } from '@web/types/common.component'
import './ProfileDefaultPageLayout.scss'
import { StringUtil } from '@web/lib/util/string.util'
import { CrepenUser } from '@web/services/types/object/user.object'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-regular-svg-icons'
import { ProfileUserDataProvider } from '../providers/user-data-provider/ProfileUserDataProvider'
import { ProfileMenu } from '../containers/profile-menu/ProfileMenu'
import { PropsWithChildren } from 'react'

interface ProfileDefaultPageLayoutProp extends PropsWithChildren<PropsWithClassName> {
    userData: CrepenUser,
    category : string
}

export const ProfileDefaultPageLayout = (prop: ProfileDefaultPageLayoutProp) => {
    return (
        <div
            className={StringUtil.joinClassName('cp-page-layout', 'cp-profile-default-page-layout', prop.className)}
            data-category={prop.category}
        >
            <ProfileUserDataProvider
                userData={prop.userData}
            >
                <div className='cp-page-header'>
                    <div className='cp-page-title'>
                        <FontAwesomeIcon
                            icon={faUser}
                            className='cp-title-folder-icon'
                        />
                        <span>Profile</span>
                    </div>
                </div>
                <div className='cp-page-content'>
                    <ProfileMenu
                        className='cp-profile-menu'
                        activeMenu={prop.category}
                    />
                    <div className="cp-profile-section">
                        {prop.children}
                    </div>
                </div>
                <div className='cp-page-footer'>

                </div>
            </ProfileUserDataProvider>

        </div>
    )
}