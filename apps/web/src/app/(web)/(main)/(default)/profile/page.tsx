
import '@web/assets/style/cloud/page/profile/profile.cloud.scss';
import { ProfileDefaultPageLayout } from '@web/components-v2/page/profile/(default)/layout/ProfileDefaultPageLayout';
import { ProfileChangeInfoCategory } from '@web/components/page/profile/change-info.category';
import { ProfileChangePasswordCategory } from '@web/components/page/profile/change-password.category';
import { CrepenUserOperationService } from '@web/services/operation/user.operation.service';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Fragment } from 'react';



const CloudProfileRoutePage = async () => {

    const ua = (await headers()).get('user-agent');
    const isMobile = /Mobi|Android/i.test(ua ?? '');


    if (!isMobile) {
        redirect('/profile/user')
    }








    const userData = await CrepenUserOperationService.getLoginUserData();



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
                    category={'none'}
                >
                    
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

export default CloudProfileRoutePage;