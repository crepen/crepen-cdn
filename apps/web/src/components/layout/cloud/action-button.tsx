import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

interface CloudHeaderActionButtonProp {
    icon: IconProp
}

const CloudHeaderActionButton = (prop: CloudHeaderActionButtonProp) => {
    return (
        <button className="cp-action-button">
            <FontAwesomeIcon
                className="cp-icon"
                icon={prop.icon}
            />
        </button>
    )
}

export default CloudHeaderActionButton;