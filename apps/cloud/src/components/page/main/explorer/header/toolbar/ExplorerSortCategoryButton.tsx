'use client'

import { useClientLocale } from "@web/lib/module/locale/ClientLocaleProvider";
import { Fragment, RefObject, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";

interface ExplorerSortCategoryButtonProp {
    categoryList: { key: string, text: string }[],
    defaultCategory: { key: string, text: string }
}

export const ExplorerSortCategoryButton = (prop: ExplorerSortCategoryButtonProp) => {

    const [isListOpen, setListOpenState] = useState<boolean>(false);
    const [winObj, setWinObj] = useState<Window | undefined>(undefined);
    const [selectCategory, setSelectCategory] = useState<{ key: string, text: string }>(prop.defaultCategory);

    const localeHook = useClientLocale();
    const searchParamHook = useSearchParams();
    const router = useRouter();

    const buttonRef = useRef<HTMLButtonElement>(null);


    const buttonClickEventHandler = () => {
        setListOpenState(!isListOpen);
    }


    const changeCategoryEventHandler = (applyCategory: { key: string, text: string }) => {
        const params = new URLSearchParams(searchParamHook);

        params.set('sortCategory', applyCategory.key);

        router.replace(`?${params.toString()}`);

    }

    useEffect(() => {
        setWinObj(window);
    }, [])

    useEffect(() => {
        const params = new URLSearchParams(searchParamHook);
        const queryCategory = params.has('sortCategory') ? params.get('sortCategory') : undefined;

        setSelectCategory(
            prop.categoryList.find(x => x.key === queryCategory)
            ?? prop.defaultCategory
        );


    }, [searchParamHook])


    return (
        <Fragment>
            <button
                className='cp-header-bt cp-sort-category-bt'
                onClick={buttonClickEventHandler}
                ref={buttonRef}
            >
                <div className='cp-button-text'>
                    {localeHook.translate('page.main.explorer.header.button.sort')} : {selectCategory.text}
                </div>

            </button>

            {
                (isListOpen && winObj) &&
                createPortal(
                    <ExplorerSortCategorySelectListModal
                        categoryList={prop.categoryList}
                        onClose={(applyCategory: { key: string, text: string } | undefined) => {
                            if (applyCategory) {
                                changeCategoryEventHandler(applyCategory);
                            }
                            setListOpenState(false);
                        }}
                        position={{
                            top: (buttonRef.current?.offsetTop ?? 0) + (buttonRef.current?.offsetHeight ?? 0),
                            left: (buttonRef.current?.offsetLeft ?? 0) + (buttonRef.current?.offsetWidth ?? 0),
                        }}
                        buttonRef={buttonRef}
                    />,
                    winObj.document.body
                )

            }


        </Fragment>

    )
}

interface ExplorerSortCategorySelectListModalProp {
    categoryList: { key: string, text: string }[],
    onClose: (applyCategory: { key: string, text: string } | undefined) => void,
    position: {
        top: number,
        left: number
    },
    buttonRef: RefObject<HTMLButtonElement | null>
}

const ExplorerSortCategorySelectListModal = (prop: ExplorerSortCategorySelectListModalProp) => {

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
        modalRef.current?.style.setProperty('--list-height', `${modalListRef.current?.offsetHeight ?? 0}px`)
        modalRef.current?.classList.add('active');
        modalRef.current?.style.setProperty('top', `${prop.position.top + 10}px`);
        modalRef.current?.style.setProperty('left', `${prop.position.left - modalRef.current.offsetWidth}px`);

        window.addEventListener('mousedown', closeEventHandler)
        return (() => {
            window.removeEventListener('mousedown', closeEventHandler)
        })
    }, [])




    return (
        <div className="cp-sort-category-select-modal" ref={modalRef}>
            <ul className="cp-sort-category-list" ref={modalListRef}>
                {
                    prop.categoryList.map(category => (
                        <li
                            key={category.key}
                            className="cp-category-item"
                            onClick={(e) => {
                                prop.onClose(category);
                            }}
                        >
                            {category.text}
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}