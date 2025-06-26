'use client'

import { useState } from 'react'
import './toggle-button.common.scss'

interface CrepenToggleButtonProp {
    defaultState: boolean,
    onChange?: (state: boolean) => Promise<boolean>
}

export const CrepenToggleButton = (prop: CrepenToggleButtonProp) => {

    const [isToggle, setToggleState] = useState<boolean>(prop.defaultState ?? false);

    return (
        <div className="cp-toggle-bt" data-toggle-state={isToggle}>
            <div
                className='cp-toggle-move-box'
                onClick={async () => {
                    const changeState = !isToggle
                    setToggleState(changeState)
                    if (prop.onChange) {
                        const changeSuccess = await prop.onChange(changeState);
                        if(!changeSuccess){
                            setToggleState(!changeState);
                        }
                    }
                }}
            >
                <div className='cp-toggle-circle' />
            </div>

        </div >
    )
}