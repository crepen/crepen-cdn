import Image from "next/image";
import { PropsWithChildren } from "react";
import CloudHeaderMenuButton from "../menu-button";
import { faHome, faGear, faFolder } from "@fortawesome/free-solid-svg-icons";
import CloudHeaderActionButton from "../action-button";

import LogoImage from '@web/assets/img/crepen-cdn-logo.png';
import { CloudGlobalAsideWrap } from "./cloud.aside.wrap";

interface HeaderMenuAsideProp extends PropsWithChildren {
    className?: string
}

const CloudGlobalAside = (prop: HeaderMenuAsideProp) => {
    return (
        <CloudGlobalAsideWrap
            className={prop.className}
        >
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
                    linkHref={'/'}
                />
                <CloudHeaderMenuButton
                    label='Menu2'
                />
                <CloudHeaderMenuButton
                    icon={faFolder}
                    label='Explorer'
                    type='link'
                    linkHref='/explorer/folder'
                />
            </div>
            <div className='cp-aside-item cp-bottom'>
                <div className='cp-action'>
                    <CloudHeaderActionButton
                        icon={faGear}
                    />
                </div>
            </div>
        </CloudGlobalAsideWrap>

    )
}

export default CloudGlobalAside;