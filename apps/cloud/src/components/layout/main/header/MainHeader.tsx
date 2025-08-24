import Image from "next/image"
import { BasePathInitializer } from "@web/lib/module/basepath/BasePathInitializer"
import { headers } from "next/headers"
import urlJoin from "url-join"
import { MainHeaderLinkMenu } from "./MainHeaderLinkMenu"
import Link from "next/link"
import { MainHeaderMenuType } from "../../../../app/(web)/(main)/layout"
import { MainHeaderUploadMonitorButton } from "./header-action/MainHeaderUploadMonitorButton"
import { MainHeaderBuggerButton } from "./header-action/MainHeaderBuggerButton"

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
                            matchUrl={x.matchUrl}
                        />
                    ))
                }

            </div>
            <div className="cp-header-box cp-action-box">
                <MainHeaderUploadMonitorButton />
                <MainHeaderBuggerButton />
            </div>
        </header>
    )
}