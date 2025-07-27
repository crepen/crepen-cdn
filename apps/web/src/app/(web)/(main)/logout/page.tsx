'use client'

import { useGlobalBasePath } from "@web/component/config/GlobalBasePathProvider";
import { CustomEnvProvider } from "@web/modules/server/service/CustomEnvProvider";
import { useRouter } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { useEffect } from "react";
import urlJoin from "url-join";

export const MainLogoutPageRouter = () => {

    // const basePath = useGlobalBasePath();
    const route = useRouter();
    const basePath = useGlobalBasePath();

    const logout = async () => {
        try {
            const apiUrl = basePath.join('/api/signout');

            const result = await fetch(apiUrl, {
                method: 'DELETE'
            })

            


            route.push('/login')
        }
        catch (e) {
            route.push('/error')
        }
    }

    useEffect(() => {
        logout();
    }, [])


}

export default MainLogoutPageRouter;