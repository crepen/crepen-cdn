'use client'

import { useGlobalBasePath } from "@web/component/config/GlobalBasePathProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const MainLogoutPageRouter = () => {

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