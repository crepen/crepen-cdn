import '@web/assets/styles/main/site-properties.page.scss';
import { DatabasePropertyGroup } from '@web/component/main/site-property/DatabasePropertyGroup';
import { SessionProvider } from '../../../../modules/session/SessionProvider';
import { cookies } from 'next/headers';
import { RestAdminPropertyData } from '../../../../modules/server-data/RestAdminPropertyData';

const SitePropertiesPage = async () => {

    const session = await SessionProvider.instance(await cookies()).getSession();

    const dataProperties = await RestAdminPropertyData
        .init(process.env.API_URL)
        .getSiteProperties(session.token?.act);


    return (
        <div className="cp-page cp-site-properties-page">
            <div className="cp-page-header">
                <div className="cp-page-title">
                    사이트 설정
                </div>
                <div className="cp-page-subtitle">
                    웹사이트의 기본 설정과 환경을 관리합니다
                </div>
            </div>

            <div className='cp-page-content'>
                <DatabasePropertyGroup
                    databaseValue={dataProperties.data?.db}
                />
            </div>
        </div>
    )
}

export default SitePropertiesPage;