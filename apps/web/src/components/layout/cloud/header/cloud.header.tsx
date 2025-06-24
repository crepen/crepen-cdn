import { CloudHeaderMenuButton } from "./cloud.menu.button";
import { CloudHeaderBackwardButton } from "./cloud.backward.button";
import { ProfileButton } from "@web/components/controls/button/profile/profile.button";
import { CrepenUserOperationService } from "@web/services/operation/user.operation.service";
import { redirect } from "next/navigation";

/** @deprecated */
const CloudGlobalHeader = async () => {

    const loginUserData = await CrepenUserOperationService.getLoginUserData();

    if(!loginUserData.success || loginUserData.data === undefined){
        redirect('/error')
    }

    return (
        <div className="cp-header cp-container-header">
            <div className='cp-action cp-left'>
                <CloudHeaderMenuButton />
                <CloudHeaderBackwardButton />
            </div>
            <div className='cp-action cp-right'>
                <ProfileButton 
                    userInfo={loginUserData.data}
                />
            </div>
        </div>
    )
}

export default CloudGlobalHeader;