import '@web/assets/style/cloud/layout/cloud.layout.scss';


import { PropsWithChildren, Suspense } from "react";
import CloudGlobalHeader from '@web/components/layout/cloud/header/cloud.header';
import { MainAside } from '@web/components/layout/main/aside/aside.main';
import { MainWrapper } from '@web/components/layout/main/wrap/wrap.main';
import { MainHeader } from '@web/components/layout/main/header/header.main';

interface CloudGlobalLayoutRouterProp extends PropsWithChildren {

}

const CloudGlobalLayoutRouter = (prop: CloudGlobalLayoutRouterProp) => {
    return (
        <MainWrapper className='cp-cloud cp-layout'>
            {/* <CloudGlobalAside className='cp-aside' /> */}
            <MainAside className='cp-aside' />
            <MainHeader />
            {/* <CloudGlobalHeader /> */}
            <div className='cp-container'>

                <Suspense fallback={<div>LOADING</div>}>
                    {prop.children}
                </Suspense>

            </div>

        </MainWrapper>
    );
}

export default CloudGlobalLayoutRouter;