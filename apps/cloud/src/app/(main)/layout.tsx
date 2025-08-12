import '@web/assets/styles/layout/main.layout.scss';
import { MainHeader } from '@web/component/layout/main/header/MainHeader';
import { BasePathInitializer } from '@web/lib/module/basepath/BasePathInitializer';
import { Metadata } from 'next';
import { headers } from 'next/headers';

import { PropsWithChildren } from "react";
import urlJoin from 'url-join';



const MainDefaultLayout = async (prop: PropsWithChildren) => {

    
    


    return (
        <div className="cp-internal-layout cp-layout cp-main-layout">
            {/* <MainNav /> */}
            <MainHeader />
            <main>
                <div className='cp-main'>
                    {prop.children}
                </div>

            </main>
            {/* <article>
                <section>
                    <div className='cp-section-box'>
                        {prop.children}
                    </div>
                </section>
            </article> */}
        </div>
    )
}

export default MainDefaultLayout;