'use client'

import { useGlobalBasePath } from "@web/component/config/GlobalBasePathProvider";
import { StringUtil } from "@web/lib/util/string.util";
import { useGlobalAsideExpandState } from "@web/lib/zustand-state/cloud.global.state";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { PropsWithChildren } from "react";

interface CustomLinkProp extends PropsWithChildren {
    href?: string,
    className?: string
}

export const CustomLink = (prop: CustomLinkProp) => {
    const router = useRouter();
    const pathname = usePathname();
    const asideExpand = useGlobalAsideExpandState()

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {

        if (pathname === prop.href) {
            e.preventDefault();
            router.refresh();
            asideExpand.toggle(false);
        }
    };

    return (
        <Link
            href={prop.href ?? '#'}
            className={StringUtil.joinClassName('cp-custom-link', prop.className)}
            onClick={handleClick}
        >
            {prop.children}
        </Link>
    );
}