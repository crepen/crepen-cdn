import { Dispatch, Ref, RefObject, SetStateAction, useEffect, useRef } from "react"

interface MainProfileToastProp {
    position?: { left?: number, bottom?: number },
    ref?: RefObject<HTMLDivElement | null> | undefined;
} 

export const MainProfileToast = (prop: MainProfileToastProp) => {




    const closeEventHandler = (e: Event) => {
        if (prop.ref?.current && !prop.ref.current.contains(e.target as HTMLElement)) {
            prop.ref?.current?.classList.remove('cp-show');
        }
    }


    useEffect(() => {
        if (prop.ref?.current) {
            prop.ref.current.style.setProperty('bottom', `${prop.position?.bottom ?? 0}px`)
            prop.ref.current.style.setProperty('left', `${prop.position?.left ?? 0}px`)
        }

    }, [prop.position?.left])

    useEffect(() => {
        document.addEventListener('click', closeEventHandler);
        return () => {
            document.removeEventListener('click', closeEventHandler);
        }
    }, [])

    return (
        <div className="cp-toast cp-profile-toast" ref={prop.ref} >
            <button>Logout</button>
        </div>
    )
}