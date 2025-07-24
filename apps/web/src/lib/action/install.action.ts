'use server'

import { CrepenSystemInstallOperationService } from "@web/modules/crepen/system/install/CrepenSystemInstallOperationService";
import { CommonUtil } from "../util/common.util"
import { StringUtil } from "../util/string.util";
import { cookies } from "next/headers";
import * as DateFns from 'date-fns'

interface SetupSystemDatabaseResult {
    isSuccess?: boolean,
    message?: string
}

export const testDatabaseConnect = async (currentState: SetupSystemDatabaseResult, formData: FormData): Promise<SetupSystemDatabaseResult> => {

    // await CommonUtil.delay(2000);

    const host = formData.get('host')?.toString();
    const portStr = formData.get('port')?.toString();
    const port = isNaN(Number(portStr)) ? 0 : Number(portStr);
    const username = formData.get('username')?.toString();
    const password = formData.get('password')?.toString();
    const database = formData.get('database')?.toString();


    const checkDatabaseReq = await CrepenSystemInstallOperationService.checkDatabase({
        host: host,
        database: database,
        password: password,
        port: port,
        username: username
    })



    if (checkDatabaseReq.success) {
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
    }





    return {
        isSuccess: checkDatabaseReq.success && checkDatabaseReq.data?.state,
        message: checkDatabaseReq.message
    }
}