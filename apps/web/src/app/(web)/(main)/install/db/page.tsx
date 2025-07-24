'use server'

import { SystemInstallDatabasePageLayout } from "@web/components-v2/page/install/db/layout/SystemInstallDatabasePageLayout";
import { cookies } from "next/headers";

const InstallDatabaseRoutePage = async () => {

    let data = {};
    const cookie = await cookies();
    try {
        data = JSON.parse(cookie.get('CP_INSTALL_DB')?.value.toString() ?? '{}')
    }
    catch (e) {/** empty */ }



    return <SystemInstallDatabasePageLayout
        defaultValue={{
            ...data
        }}
    />;
}




export default InstallDatabaseRoutePage;