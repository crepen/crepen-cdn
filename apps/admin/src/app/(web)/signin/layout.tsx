import '@web/assets/styles/signin/signin.layout.scss';
import { PropsWithChildren } from 'react';

const AdminSignInLayout = (prop: PropsWithChildren) => {
    return (
        <div className='cp-layout cp-signin-layout'>
            {prop.children}
        </div>
    )
}

export default AdminSignInLayout;