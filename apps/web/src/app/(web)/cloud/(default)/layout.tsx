import '@web/assets/style/cloud/layout/cloud.layout.scss';


import { PropsWithChildren } from "react";
import HeaderMenuAside from '@web/components/layout/cloud/menu-aside';

interface CloudGlobalLayoutRouterProp extends PropsWithChildren {

}

const CloudGlobalLayoutRouter = (prop: CloudGlobalLayoutRouterProp) => {
    return (
        <div className='cp-cloud cp-layout'>
            <HeaderMenuAside className='cp-aside' />
            <div className='cp-container'>
                {prop.children}
            </div>

        </div>
    );
}

export default CloudGlobalLayoutRouter;