import { StringUtil } from '@web/lib/util/string.util'
import './avartar.button.scss'


interface AvartarIconButtonProp {
    className? : string
}

export const AvartarIconButton = (prop : AvartarIconButtonProp) => {
    return (
        <button className={StringUtil.joinClassName('cp-button cp-avartar-bt' , prop.className)}>
            DS
        </button>
    )
}