import { StringUtil } from "@web/lib/util/StringUtil"
import Link from "next/link"
import { PropsWithChildren } from "react"
import { MdArrowForwardIos } from "react-icons/md"

interface ExplorerFolderNavProp {
    
}

export const ExplorerFolderNav = (prop : PropsWithChildren<ExplorerFolderNavProp>) => {
    return (
        <div className="cp-explorer-folder-nav">
            {prop.children}
        </div>
    )
}


interface ExplorerFolderNavItemProp {
    title : string,
    link : string,
    disabled? : boolean
}

const ExplorerFolderNavItem = (prop : ExplorerFolderNavItemProp) => {
    return (
        <Link href={prop.link} className={StringUtil.joinClassName("cp-explorer-folder-item" , prop.disabled ? 'cp-disable' : '')}>
            {prop.title}
        </Link>
    )
}

const ExplorerFolderSpliter = () => {
    return (
        <div className="cp-explorer-folder-spliter">
            <MdArrowForwardIos size={8}/>
        </div>
    )
}


ExplorerFolderNav.Item = ExplorerFolderNavItem;
ExplorerFolderNav.Spliter = ExplorerFolderSpliter;