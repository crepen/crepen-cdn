import { MainHeader } from '@web/components/layout/default/main-header';
import { Fragment, PropsWithChildren } from 'react'

import '@web/assets/style/main/layout.scss';

const MainLayout = ({ children }: PropsWithChildren) => {
    return (
        <div className='cp-main cp-layout'>
            <MainHeader />
            <main>
                {children}
            </main>
        </div>
    )
}

export default MainLayout; 