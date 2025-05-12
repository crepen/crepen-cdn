import './loading-button.scss';

import { StringUtil } from "../../../lib/util/string.util"
import BaseButton from '../base-button/base-button';

interface LoadingButtonProp {
    type: 'submit' | 'button',
    className?: string,
    isLoading : boolean,
    label : string
}

const LoadingButton = (prop: LoadingButtonProp) => {
    return (
        <BaseButton
            type={prop.type}
            theme='primary'
            className={StringUtil.joinClassName('crepen-loading-bt', prop.className)}
            isDisable={prop.isLoading}
        >
            <span className="inner-text">{prop.label}</span>
            <div className="inner-loader"></div>
        </BaseButton>
    )
}

export default LoadingButton;