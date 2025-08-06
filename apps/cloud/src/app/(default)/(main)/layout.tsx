import '@web/assets/styles/layout/main.layout.scss';
import { MainHeader } from '@web/component/layout/main/header/MainHeader';
import { MainNav } from '@web/component/layout/main/nav/MainNav';
import { LocaleConfig } from '@web/lib/config/LocaleConfig';
import { ServerLocaleInitializer } from '@web/lib/module/locale/ServerLocaleInitializer';
import { cookies } from 'next/headers';

import { PropsWithChildren } from "react";


const MainDefaultLayout = async (prop: PropsWithChildren) => {




    return (
        <div className="cp-internal-layout cp-layout cp-main-layout">
            <MainNav />
            <article>
                <MainHeader />
                <section>
                    <div className='cp-section-box'>
                        {prop.children}
                    </div>
                </section>
            </article>
        </div>
    )
}

export default MainDefaultLayout;