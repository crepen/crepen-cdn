'use client'

import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { StringUtil } from "@web/lib/util/string.util";
import Link from "next/link";
import { PropsWithChildren, useState } from "react";

type CloudHeaderMenuButtonType = 'category' | 'link';

interface CloudHeaderMenuButtonProp {
    icon?: IconProp,
    label: string,
    type?: CloudHeaderMenuButtonType,
    linkHref?: string
}

const CloudHeaderMenuButton = (prop: CloudHeaderMenuButtonProp) => {

    const [categoryState , setState] = useState<'expend' | 'collapse'>('collapse');

    const categoryClickHandler = () => {
        setState(categoryState === 'collapse' ? 'expend' : 'collapse');
    }

    return (
        <SwitchTypeElement
            type={prop.type ?? 'link'}
            className={StringUtil.joinClassName('cp-menu-item', prop.type === 'category' ? 'cp-category' : 'cp-button')}
            href={prop.linkHref}
            categoryOnClick={categoryClickHandler}
        >
            <div className="cp-menu-icon">
                {
                    prop.icon &&
                    <FontAwesomeIcon
                        className="cp-icon"
                        icon={prop.icon}
                    />
                }
            </div>
            <div className="cp-menu-label">
                {prop.label}
            </div>
            <div className={StringUtil.joinClassName("cp-category-button" , `cp-${categoryState}`)}>
                <FontAwesomeIcon icon={faAngleUp} />
            </div>
        </SwitchTypeElement>
    )
}

interface SwitchTypeElementProp extends PropsWithChildren {
    type: CloudHeaderMenuButtonType,
    href?: string,
    className?: string,
    categoryOnClick?: () => void
}

const SwitchTypeElement = (prop: SwitchTypeElementProp) => {

    if (prop.type === 'link') {
        return (
            <Link href={prop.href ?? '#'} className={prop.className}>
                {prop.children}
            </Link>
        )
    }
    else {
        return (
            <button
                className={prop.className}
                onClick={prop.categoryOnClick}
            >
                {prop.children}
            </button>
        )
    }

}

export default CloudHeaderMenuButton;