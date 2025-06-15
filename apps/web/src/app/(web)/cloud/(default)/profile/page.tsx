
import '@web/assets/style/cloud/page/profile/profile.cloud.scss';
import { ProfileChangeInfoCategory } from '@web/components/page/profile/change-info.category';
import { ProfileChangePasswordCategory } from '@web/components/page/profile/change-password.category';
import { CrepenUserOperationService } from '@web/services/operation/user.operation.service';



const CloudProfileRoutePage = async () => {

    const userData = await CrepenUserOperationService.getLoginUserData();

    console.log(userData);

    return (
        <div className='cp-page cp-page-profile'>
            <ProfileChangePasswordCategory />
            <ProfileChangeInfoCategory 
                userData={userData.data}
            />
        </div>
    )
}

export default CloudProfileRoutePage;