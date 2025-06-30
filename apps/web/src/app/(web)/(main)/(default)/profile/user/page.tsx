
import '@web/assets/style/cloud/page/profile/profile.cloud.scss';
import { ProfileDefaultPageLayout } from '@web/components-v2/page/profile/(default)/layout/ProfileDefaultPageLayout';
import { ProfileUserPageLayout } from '@web/components-v2/page/profile/user/layout/ProfileUserPageLayout';
import { ProfileChangeInfoCategory } from '@web/components/page/profile/change-info.category';
import { ProfileChangePasswordCategory } from '@web/components/page/profile/change-password.category';
import { CrepenUserOperationService } from '@web/services/operation/user.operation.service';
import { Fragment } from 'react';

interface CloudProfileCategoryRoutePageProp {
    params: Promise<{
        category?: string
    }>
}

const CloudProfileUserRoutePage = async (prop: CloudProfileCategoryRoutePageProp) => {

    const userData = await CrepenUserOperationService.getLoginUserData();

    const category = (await prop.params).category;


    return (
        <Fragment>
            {
                userData.success !== true &&
                <div>
                    <div>User data load error.</div>
                    <div>{userData.message}</div>
                </div>
            }

            {
                (userData.success === true && userData.data !== undefined) &&
                <ProfileDefaultPageLayout
                    userData={userData.data}
                    category={'user'}
                >
                    <ProfileUserPageLayout 
                        data={userData.data}
                    />
                </ProfileDefaultPageLayout>
            }
        </Fragment>
        // <div className='cp-page cp-page-profile'>
        //     <ProfileChangePasswordCategory />
        //     <ProfileChangeInfoCategory 
        //         userData={userData.data}
        //     />
        // </div>
    )
}

export default CloudProfileUserRoutePage;