import './icon-button.control.scss';

import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { StringUtil } from '@web/lib/util/string.util';
import { ButtonHTMLAttributes, MouseEventHandler } from 'react';

interface CrepenIconButtonProp {
    icon: IconProp,
    text?: string,
    onClick?: MouseEventHandler<HTMLButtonElement> ,
    className? : string,
    enableTooltip? : boolean,
    tooltipText? : string
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
        >
            <FontAwesomeIcon
                icon={prop.icon}
                className="cp-button-icon"
            />
            <span className='cp-button-text'>{prop.text}</span>
        </button>
    )
}