'use client'

import { useGlobalBasePath } from "@web/modules/client/state/global.state";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import urlJoin from "url-join";

export const MainLogoutPageRouter = () => {

    const basePath = useGlobalBasePath();
    const route = useRouter();

    const logout = async () => {
        try {
            const apiUrl = urlJoin(basePath.value ?? '/', '/api/signout');

            const result = await fetch(apiUrl, {
                method: 'DELETE'
            })

            route.push('/login')
        }
        catch (e) {
            console.log(e);
            route.push('/error')
        }
    }

    useEffect(() => {
        logout();
    }, [])


}

export default MainLogoutPageRouter;