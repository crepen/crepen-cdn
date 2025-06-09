import { CloudHeaderMenuButton } from "./cloud.menu.button";
import { CloudHeaderBackwardButton } from "./cloud.backward.button";
import { ProfileButton } from "@web/components/controls/button/profile/profile.button";

const CloudGlobalHeader = () => {


    return (
        <div className="cp-header cp-container-header">
            <div className='cp-action cp-left'>
                <CloudHeaderMenuButton />
                <CloudHeaderBackwardButton />
            </div>
            <div className='cp-action cp-right'>
                <ProfileButton />
            </div>
        </div>
    )
}

export default CloudGlobalHeader;