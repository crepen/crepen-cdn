import './icon-button.control.scss';

import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { StringUtil } from '@web/lib/util/string.util';
import { ButtonHTMLAttributes, DOMAttributes, MouseEventHandler } from 'react';

interface CrepenIconButtonProp {
    icon: IconProp,
    text?: string,
    onClick?: MouseEventHandler<HTMLButtonElement> ,
    className? : string,
    enableTooltip? : boolean,
    tooltipText? : string,
    overrideAttr? : {[key: `data-${string}`]: unknown}
}

export const CrepenIconButton = (prop: CrepenIconButtonProp) => {

    const attr: ButtonHTMLAttributes<HTMLButtonElement> = {};
    if (prop.onClick) {
        attr.onClick = prop.onClick;
    }

    return (
        <button
            {...attr}
            className={StringUtil.joinClassName("cp-icon-bt" , prop.className)}
            data-type={StringUtil.isEmpty(prop.text) ? 'icon' : 'full'}
            data-enable-tooltip={prop.enableTooltip}
            data-tooltip={prop.tooltipText}
            {...prop.overrideAttr}
        >
            <FontAwesomeIcon
                icon={prop.icon}
                className="cp-button-icon"
            />
            <span className='cp-button-text'>{prop.text}</span>
        </button>
    )
}