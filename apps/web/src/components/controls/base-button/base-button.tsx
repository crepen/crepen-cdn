import './base-button.scss';

import { StringUtil } from "../../../lib/util/string.util";
import { MouseEventHandler, PropsWithChildren } from 'react';

interface BaseButtonProp extends PropsWithChildren {
    theme: 'primary' | 'secondary',
    className?: string,
    onClick? : () => MouseEventHandler<HTMLButtonElement>,
    isDisable? : boolean,
    type : 'submit' | 'button'
}

const BaseButton = (prop: BaseButtonProp) => {
    return (
        <button 
            className={StringUtil.joinClassName('crepen-base-button', prop.className)}
            data-theme={prop.theme}
            onClick={prop.onClick}
            disabled={prop.isDisable}
        >
            {prop.children}
        </button>
    )
}

export default BaseButton;