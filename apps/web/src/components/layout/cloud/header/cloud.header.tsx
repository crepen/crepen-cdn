import { faBars, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CloudHeaderMenuButton } from "./cloud.menu.button";
import { AvartarIconButton } from "@web/components/controls/button/avartar/avartar.button";
import { CloudHeaderBackwardButton } from "./cloud.backward.button";

const CloudGlobalHeader = () => {


    return (
        <div className="cp-header cp-container-header">
            <div className='cp-action cp-left'>
                <CloudHeaderMenuButton />
                <CloudHeaderBackwardButton />
            </div>
            <div className='cp-action cp-right'>
                <AvartarIconButton />
            </div>
        </div>
    )
}

export default CloudGlobalHeader;