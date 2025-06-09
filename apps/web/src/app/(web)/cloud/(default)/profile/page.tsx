
import '@web/assets/style/cloud/page/profile/profile.cloud.scss';
import { ProfileCategoryGroup } from '@web/components/page/profile/category-group';
import { ProfileChangePasswordCategory } from '@web/components/page/profile/change-password.category';



const CloudProfileRoutePage = () => {
    return (
        <div className='cp-page cp-page-profile'>
            <ProfileChangePasswordCategory />
        </div>
    )
}

export default CloudProfileRoutePage;