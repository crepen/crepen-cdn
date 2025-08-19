'use client'

import { useClientLocale } from "@web/lib/module/locale/ClientLocaleProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { Fragment, RefObject, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom";


interface ExplorerListTablePageSizeButtonProp {
    currentPageSize: number,
    defaultPageSize: number
}
export const ExplorerListTablePageSizeButton = (prop: ExplorerListTablePageSizeButtonProp) => {

    const [isListOpen, setListOpenState] = useState<boolean>(false);
    const [winObj, setWinObj] = useState<Window | undefined>(undefined);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [selectItem, setSelectItem] = useState<number>(prop.defaultPageSize);
        const translateHook = useClientLocale();

    const searchParamHook = useSearchParams();
    const router = useRouter();

     const buttonClickEventHandler = () => {
        setListOpenState(!isListOpen);
    }

    const changePageSizeEventHandler = (applyData: number) => {
        const params = new URLSearchParams(searchParamHook);

        params.set('pageSize', applyData.toString());

        router.replace(`?${params.toString()}`);

    }

    useEffect(() => {
        setWinObj(window);
    }, [])

    useEffect(() => {
        const params = new URLSearchParams(searchParamHook);
        const queryData = params.has('pageSize') ? params.get('pageSize') : undefined;

        setSelectItem(isNaN(Number(queryData)) ? prop.defaultPageSize : Number(queryData));
    }, [searchParamHook])

    return (
        <Fragment>
            <button
                className="cp-change-pagesize-bt"
                onClick={buttonClickEventHandler}
                ref={buttonRef}
            >
                {translateHook.translate('page.main.explorer.list.footer.pagesize')} : {selectItem}
            </button>



            {
                (isListOpen && winObj) &&
                createPortal(
                    <ExplorerListTablePageSizeModal
                        sizeList={[3, 5, 10, 20, 50, 100]}
                        onClose={(changeSize) => {
                            if (changeSize) {
                                changePageSizeEventHandler(changeSize);
                            }
                            setListOpenState(false);
                        }}
                        buttonRef={buttonRef}
                        position={{
                            top: (buttonRef.current?.offsetTop ?? 0) ,
                            left: (buttonRef.current?.offsetLeft ?? 0),
                        }}
                    />,
                    winObj.document.body
                )
            }

        </Fragment>
    )
}

interface ExplorerListTablePageSizeModalProp {
    sizeList: number[],
    onClose: (changeSize: number | undefined) => void,
    position: {
        top: number,
        left: number
    },
    buttonRef: RefObject<HTMLButtonElement | null>
}

const ExplorerListTablePageSizeModal = (prop: ExplorerListTablePageSizeModalProp) => {

    const modalListRef = useRef<HTMLUListElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    const closeEventHandler = (event: MouseEvent | React.MouseEvent) => {
        if (
            modalRef.current && !modalRef.current.contains(event.target as Node)
            && prop.buttonRef.current && !prop.buttonRef.current.contains(event.target as Node)
        ) {
            prop.onClose(undefined);
        }
    }

    useEffect(() => {

        const bottomPosition = window.innerHeight - (prop.buttonRef.current?.getBoundingClientRect().bottom ?? 0) + (prop.buttonRef.current?.offsetHeight ?? 0) + 5;

        modalRef.current?.style.setProperty('--list-height', `${(modalListRef.current?.offsetHeight ?? 0) + 2}px`)
        modalRef.current?.classList.add('active');
        modalRef.current?.style.setProperty('bottom', `${bottomPosition}px`);
        modalRef.current?.style.setProperty('left', `${prop.position.left}px`);

        window.addEventListener('mousedown', closeEventHandler)
        return (() => {
            window.removeEventListener('mousedown', closeEventHandler)
        })
    }, [])

    return (
        <div className="cp-change-pagesize-modal" ref={modalRef}>
            <ul className="cp-list-box" ref={modalListRef}>
                {
                    prop.sizeList.map(item => (
                        <li
                            key={item}
                            className="cp-list-item"
                            onClick={(e) => {
                                prop.onClose(item);
                            }}
                        >
                            {item}
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}