import { TouchEvent, useState } from "react"

export interface MobileDivElementProp extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    onLongTouch?: (e: TouchEvent<HTMLDivElement>) => void,
    title? : string
}

export const MobileDiv = (prop: MobileDivElementProp) => {

    const [timer, setTimer] = useState<NodeJS.Timeout | number | null>(null);


    const onLongTouchEventHandler = (e: TouchEvent<HTMLDivElement>) => {
        if (prop.onLongTouch) prop.onLongTouch(e);
    }

    return (
        <div
            {...(removeKey(prop , 'onLongTouch'))}
            {...{title : prop.title}}
            onTouchStart={(e: TouchEvent<HTMLDivElement>) => {
                const timer = setTimeout(() => onLongTouchEventHandler(e), 600)
                setTimer(timer)
                if (prop.onTouchStart) prop.onTouchStart(e);
            }}
            onTouchEnd={() => {
                if (timer) clearTimeout(timer)

            }}
            onTouchCancel={() => {
                if (timer) clearTimeout(timer)
            }}
        >
            <div >

            </div>
            {prop.children}
        </div>
    )
}


const removeKey = <T extends object, K extends keyof T>(obj: T, key: K): Omit<T, K> => {
    const { [key]: _, ...rest } = obj;
    return rest;
}