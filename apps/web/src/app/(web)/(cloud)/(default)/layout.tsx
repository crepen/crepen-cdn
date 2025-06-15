import '@web/assets/style/cloud/layout/cloud.layout.scss';


import { PropsWithChildren } from "react";
import CloudGlobalAside from '@web/components/layout/cloud/aside/cloud.aside';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faBars, faHelmetSafety } from '@fortawesome/free-solid-svg-icons';
import CloudGlobalHeader from '@web/components/layout/cloud/header/cloud.header';

interface CloudGlobalLayoutRouterProp extends PropsWithChildren {

}

const CloudGlobalLayoutRouter = (prop: CloudGlobalLayoutRouterProp) => {
    return (
        <div className='cp-cloud cp-layout'>
            <CloudGlobalAside className='cp-aside' />
            <div className='cp-container'>
                <CloudGlobalHeader />
                <div className='cp-main'>
                    {prop.children}
                </div>
            </div>

        </div>
    );
}

export default CloudGlobalLayoutRouter;