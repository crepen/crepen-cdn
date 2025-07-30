import './ProfileUserPageLayout.scss'
import { CrepenUser } from '@web/services/types/object/user.object'
import { ClientDateLocaleWrap } from '@web/components/page/common/date-locale.wrap.common'
import { CrepenLanguageService } from '@web/services/common/language.service'

interface ProfileUserPageLayoutProp {
    data: CrepenUser
}

export const ProfileUserPageLayout = async (prop: ProfileUserPageLayoutProp) => {

    const locale = await CrepenLanguageService.getSessionLocale();

    return (
        <div className='cp-category-section cp-user-section'>
            <div className='cp-section-header'>
                <span className='cp-section-title'>USER</span>
                <span className='cp-section-desc'>사용자 정보를 조회 및 수정할 수 있습니다.</span>
            </div>
            <div className='cp-section-content'>
                {/* <CrepenShadowGroup>
                    USER : 1
                </CrepenShadowGroup> */}

                {/* <div className='cp-section-line'>
                    <div className='cp-section-key'>
                        USER UID
                    </div>
                    <div className='cp-section-value'>
                        {prop.data.uid}
                    </div>
                </div> */}
                <div className='cp-section-line'>
                    <div className='cp-section-key'>
                        USER ID
                    </div>
                    <div className='cp-section-value'>
                        {prop.data.id}
                    </div>
                </div>
                <div className='cp-section-line'>
                    <div className='cp-section-key'>
                        USER NAME
                    </div>
                    <div className='cp-section-value'>
                        {prop.data.name}
                    </div>

                </div>

                <div className='cp-section-line'>
                    <div className='cp-section-key'>
                        USER EMAIL
                    </div>
                    <div className='cp-section-value'>
                        {prop.data.email}
                    </div>
                </div>

                <div className='cp-section-line'>
                    <div className='cp-section-key'>
                        USER ROLE
                    </div>
                    <div className='cp-section-value'>
                        {prop.data.roles}
                    </div>
                </div>
                <div className='cp-section-line'>
                    <div className='cp-section-key'>
                        USER ACCOUNT LOCK
                    </div>
                    <div className='cp-section-value'>
                        {prop.data.isLock ? 'LOCK' : 'UNLOCK'}
                    </div>
                </div>
                <div className='cp-section-line'>
                    <div className='cp-section-key'>
                        USER CREATE DATE
                    </div>
                    <div className='cp-section-value'>
                        {
                            prop.data.createDate
                                ? <ClientDateLocaleWrap
                                    date={prop.data.createDate}
                                    locale={locale.data ?? 'en'}
                                />
                                : '-'
                        }
                    </div>
                </div>
                <div className='cp-section-line'>
                    <div className='cp-section-key'>
                        USER UPDATE DATE
                    </div>
                    <div className='cp-section-value'>
                        {
                            prop.data.updateDate
                                ? <ClientDateLocaleWrap
                                    date={prop.data.updateDate}
                                    locale={locale.data ?? 'en'}
                                />
                                : '-'
                        }
                    </div>
                </div>

            </div>
        </div>
    )
}