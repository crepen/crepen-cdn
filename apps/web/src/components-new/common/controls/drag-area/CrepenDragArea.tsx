'use client'

import './CrepenDragArea.scss'
import { StringUtil } from "@web/lib/util/string.util"
import { PropsWithClassName } from "@web/types/common.component"
import { Fragment, PropsWithChildren, useState } from "react"

interface CrepenDragAreaProp extends PropsWithChildren<PropsWithClassName<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>>> {

}

interface MouseLocation {
    x: number,
    y: number
}

export const CrepenDragArea = (prop: CrepenDragAreaProp) => {

    const [startPosition, setStartPosition] = useState<MouseLocation | undefined>();
    const [endPosition, setEndPosition] = useState<MouseLocation | undefined>();

    return (
        <Fragment>
            <div
                {...prop}
                className={StringUtil.joinClassName("cp-drag-area", prop.className)}
                onMouseDown={(e) => {
                    if (prop.onMouseDown) {
                        prop.onMouseDown(e);
                    }

                    setStartPosition({
                        x: e.clientX,
                        y: e.clientY
                    })

                }}
                onMouseUp={(e) => {
                    setEndPosition({
                        x: e.clientX,
                        y: e.clientY
                    })
                }}
            >
                {prop.children}
            </div>
            {
                startPosition !== undefined &&
                <div
                    className='cp-drag-box'
                    style={{
                        top: startPosition.x,
                        left: startPosition.y
                    }}
                >

                </div>
            }
        </Fragment>
    )
}