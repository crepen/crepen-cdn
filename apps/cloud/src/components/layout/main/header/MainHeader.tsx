import Image from "next/image"
import { SignOutButton } from "./SignOutButton"
import { BasePathInitializer } from "@web/lib/module/basepath/BasePathInitializer"
import { headers } from "next/headers"
import urlJoin from "url-join"
import { MainHeaderLinkMenu } from "./MainHeaderMenu"
import Link from "next/link"
import { MainHeaderMenuType } from "../../../../app/(main)/layout"
import { FcMenu } from "react-icons/fc"
import { HeaderBuggerMenuButton } from "./HeaderBuggerMenuButton"

interface MainHeaderProp {
    menuList: MainHeaderMenuType[]
}

export const MainHeader = async (prop: MainHeaderProp) => {

    const basePath = await BasePathInitializer.get({ readHeader: await headers() });

    return (
        <header>
            <Link href={'/'} className="cp-header-box cp-logo-box">
                <Image
                    src={urlJoin(basePath, '/resource/image/logo.png')}
                    width={197}
                    height={66}
                    alt="Logo Image"
                    className="cp-logo"
                />
            </Link>
            <div className="cp-header-box cp-nav-box">
                {
                    prop.menuList.map((x, idx) => (
                        <MainHeaderLinkMenu
                            key={idx}
                            title={x.title}
                            icon={x.icon}
                            className={x.className}
                            link={x.link}
                        />
                    ))
                }
                
            </div>
            <div className="cp-header-box cp-profile-box">
                <button className="cp-profile-bt cp-header-action-bt">
                    Profile
                </button>
                <SignOutButton />
            </div>

            <div className="cp-header-box cp-bugger-box">
                <HeaderBuggerMenuButton />
            </div>


        </header>
    )
}