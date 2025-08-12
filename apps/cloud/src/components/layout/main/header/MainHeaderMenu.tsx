'use client'


import { useClientBasePath } from "@web/lib/module/basepath/ClientBasePathProvider"
import { StringUtil } from "@web/lib/util/StringUtil"
import { UrlUtil } from "@web/lib/util/UrlUtil"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { URLPattern } from "next/server"
import { ReactNode, useEffect, useState } from "react"
import urlJoin from "url-join"

interface HeaderMenuProp {
    className?: string,
    title? : string,
    icon? : ReactNode,
    link? : string
}

export const MainHeaderMenu = (prop : HeaderMenuProp) => {

    const [isActive , setActiveState] = useState<boolean>(false);
    const basePathHook = useClientBasePath();
    const pathNameHook = usePathname();


    useEffect(() => {
   
        // console.log(`[MATCH : ${prop.link} - ${location.href}]`, UrlUtil.isMatchPattern(location.href , prop.link ?? '' , {basePath : basePathHook.getBasePath()}))

        if(UrlUtil.isMatchPattern(location.href , prop.link ?? '' , {basePath : basePathHook.getBasePath()})){
            setActiveState(true);
        }
        else{
            setActiveState(false);
        }
    },[pathNameHook])

    return (
        <Link href={prop.link ?? '#'} className={StringUtil.joinClassName("cp-nav-menu" , prop.className , isActive ? 'active' : undefined)}>
            {prop.icon} {prop.title}
        </Link>
    )
}