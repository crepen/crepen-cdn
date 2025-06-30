import './ProfilePasswordPageLayout.scss'
import { CrepenUser } from '@web/services/types/object/user.object'
import { ClientDateLocaleWrap } from '@web/components/page/common/date-locale.wrap.common'
import { CrepenLanguageService } from '@web/services/common/language.service'

interface ProfileUserPageLayoutProp {
    data: CrepenUser
}

export const ProfilePasswordPageLayout = async (prop: ProfileUserPageLayoutProp) => {

    const locale = await CrepenLanguageService.getSessionLocale();

    return (
        <div className='cp-category-section cp-user-section'>
            <div className='cp-section-header'>
                <span className='cp-section-title'>Password</span>
                <span className='cp-section-desc'>사용자 비밀번호를 수정할 수 있습니다.</span>
            </div>
            <div className='cp-section-content'>
                {/* <CrepenShadowGroup>
                    USER : 1
                </CrepenShadowGroup> */}

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

                </div>
                <div className='cp-section-line'>

                </div>
            </div>
        </div>
    )
}