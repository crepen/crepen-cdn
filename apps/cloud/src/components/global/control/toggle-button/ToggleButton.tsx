'use client'

import { RefObject, useImperativeHandle, useMemo, useState } from 'react'
import './toggle-button.control.scss'
import { StringUtil } from "@web/lib/util/StringUtil"

interface ToggleButtonProp {
    className?: string,
    toggleRef?: RefObject<ToggleButtonRef | null>,
    width?: number,
    onChange?: (state: boolean) => Promise<boolean> | boolean | Promise<void> | void,
    defaultActiveState? : boolean,
    hidden?: boolean
}

export interface ToggleButtonRef {
    isActive: boolean,
}

export const ToggleButton = (prop: ToggleButtonProp) => {

    useImperativeHandle(prop.toggleRef, () => ({
        isActive: isActive
    }))

    const [isActive, setActive] = useState<boolean>(prop.defaultActiveState ?? false);
    const [isLoading, setLoading] = useState<boolean>(false);


    return (
        <div
            aria-hidden={prop.hidden}
            className={
                StringUtil.joinClassName(
                    "cp-toggle-button",
                    "cp-control",
                    prop.className,
                    isActive ? 'cp-active' : ''
                )
            }
            style={{
                width: prop.width
            }}
            onClick={async () => {

                console.log(isLoading);
                if (!isLoading) {
                    if (prop.onChange) {
                        setLoading(true);
                        let isSuccess = true;
                        const res = prop.onChange(isActive);

                        if (res instanceof Promise) {
                            if (typeof (await res) === 'boolean') {
                                isSuccess = (await res) as boolean;
                            }
                        }
                        else {
                            if (typeof res === 'boolean') {
                                isSuccess = res as boolean;
                            }
                        }

                        if (isSuccess) {
                            setActive(!isActive);
                        }

                        setLoading(false);
                    }
                }


            }}
        >
            <div className='cp-move-box'>

            </div>
        </div>
    )
}