import Image from "next/image";
import { PropsWithChildren } from "react";
import CloudHeaderMenuButton from "./menu-button";
import { faHome, faProjectDiagram, faGear } from "@fortawesome/free-solid-svg-icons";
import CloudHeaderActionButton from "./action-button";

import LogoImage from '@web/assets/img/crepen-cdn-logo.png';

interface HeaderMenuAsideProp extends PropsWithChildren {
    className?: string
}

const HeaderMenuAside = (prop: HeaderMenuAsideProp) => {
    return (
        <div className={prop.className}>
            <div className='cp-aside-item cp-top'>
                <Image
                    src={LogoImage}
                    alt='logo'
                    className='cp-logo-img'
                    width={100}
                />
            </div>
            <div className='cp-aside-item cp-menu'>
                <CloudHeaderMenuButton
                    icon={faHome}
                    label='Home'
                    type='link'
                    linkHref='/cloud'
                />
                <CloudHeaderMenuButton
                    icon={faProjectDiagram}
                    label='Group'
                    linkHref='/cloud/group'
                />
                <CloudHeaderMenuButton
                    label='Menu2'
                />
            </div>
            <div className='cp-aside-item cp-bottom'>
                <div className='cp-action'>
                    <CloudHeaderActionButton
                        icon={faGear}
                    />
                </div>
            </div>
        </div>
    )
}

export default HeaderMenuAside;