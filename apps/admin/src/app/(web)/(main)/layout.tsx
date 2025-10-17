import '@web/assets/styles/main/main.layout.scss';
import { cookies, headers } from 'next/headers';
import Link from 'next/link';
import { PropsWithChildren } from 'react';
import { GrDashboard } from 'react-icons/gr';
import { LocaleProvider } from '../../../modules/locale-module/LocaleProvider';
import { RestAdminAuthData } from '../../../modules/server-data/RestAdminAuthData';
import { SessionProvider } from '../../../modules/session/SessionProvider';
import { InitAccountPasswordProvider } from '@web/component/global/init-account-password/InitAccountPasswordProvider';

const AdminMainLayout = async (prop: PropsWithChildren) => {

    const header = await headers();
    const basePath = header.get('X-CP-BASEPATH') ?? '/';
    const localeProv = LocaleProvider.getInstance();

    const restAuthDataProv = new RestAdminAuthData(process.env.API_URL);
    const session = await SessionProvider.instance(await cookies()).getSession();

    const initAccountState = await restAuthDataProv.getInitAccountState(session.token?.act);

    return (
        <div className="cp-layout cp-main-layout">
            <InitAccountPasswordProvider
                isInitPassword={initAccountState.data?.initPassword ?? false}
            />
            <header>
                <div className='cp-header-section'>
                    1111
                </div>
                <div className='cp-header-section'>
                    HEADER
                </div>
                <div className='cp-header-section'>
                    <button>Profile</button>
                </div>

            </header>
            <nav>
                <div className='cp-nav-logo'>

                </div>
                <div className='cp-nav-menu'>
                    <Link href={'/'} className='cp-menu-item'>
                        <div className='cp-menu-icon'>
                            <GrDashboard />
                        </div>
                        <div className='cp-menu-text'>
                            {localeProv.translate('ADMIN.MAIN.COMMON.NAV.MENU.DASHBOARD')}
                        </div>

                    </Link>
                    <Link href={'/site-properties'} className='cp-menu-item'>
                        <div className='cp-menu-icon'>
                            <GrDashboard />
                        </div>
                        <div className='cp-menu-text'>
                            {localeProv.translate('ADMIN.MAIN.COMMON.NAV.MENU.SITE_PROPERTIES')}
                        </div>
                    </Link>
                </div>
                <div className='cp-nav-action'>
                    <Link href={'/logout'} className='cp-menu-item'>
                        <div className='cp-menu-icon'>
                            <GrDashboard />
                        </div>
                        <div className='cp-menu-text'>
                            Logout
                        </div>

                    </Link>
                </div>
            </nav>
            <section>
                {prop.children}
            </section>
        </div>
    )
}

export default AdminMainLayout;