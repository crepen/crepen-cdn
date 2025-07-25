'use server'

import { cookies } from "next/headers";
import * as DateFns from 'date-fns'
import { SystemDataService } from "@web/modules/api/service/SystemDataService";

interface SetupSystemDatabaseResult {
    isSuccess?: boolean,
    message?: string
}

export const testDatabaseConnect = async (formData: FormData): Promise<SetupSystemDatabaseResult> => {

    const host = formData.get('host')?.toString();
    const portStr = formData.get('port')?.toString();
    const port = isNaN(Number(portStr)) ? 0 : Number(portStr);
    const username = formData.get('username')?.toString();
    const password = formData.get('password')?.toString();
    const database = formData.get('database')?.toString();


    const tryDBConnResult = await SystemDataService.applySystemData({
        dbHost: host,
        dbDatabase: database,
        dbPassword: password,
        dbPort: port,
        dbUsername: username
    })

    if (tryDBConnResult.state) {
        const cookie = await cookies();
        cookie.set('CP_INSTALL_DB', JSON.stringify({
            host: host,
            database: database,
            password: password,
            port: port,
            username: username
        }), {
            secure: true,
            httpOnly: process.env.NODE_ENV === 'production',
            expires: DateFns.addMinutes(new Date(), 5)
        })

        return {
            isSuccess: true
        }
    }
    else {
        return {
            isSuccess: false,
            message: tryDBConnResult.message
        }
    }
}