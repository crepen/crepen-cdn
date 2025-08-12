'use server'

import { cookies } from "next/headers";
import { LocaleConfig } from "../config/LocaleConfig";
import { RestAuthDataService } from "../module/api-module/RestAuthDataService";
import { AuthProvider } from "../module/auth/AuthProvider"
import { ServerLocaleInitializer } from "../module/locale/ServerLocaleInitializer";
import { CommonUtil } from "../util/CommonUtil";

interface SignInActionResult {
    state: boolean,
    message?: string
}

export const SignInAction = async (id?: string, password?: string): Promise<SignInActionResult> => {

    try {
        const locale = await (await ServerLocaleInitializer.current(LocaleConfig)).get({
            readCookie: await cookies()
        });

        const signinResponse = await RestAuthDataService.current(undefined, locale ?? LocaleConfig.defaultLocale).login(id, password);


        if(signinResponse.success){
            await AuthProvider.current().setSessionToken({
                accessToken : signinResponse.data?.accessToken,
                refreshToken : signinResponse.data?.refreshToken
            })
        }


        return {
            state : signinResponse.success,
            message : signinResponse.message
        }
    }
    catch (e) {
        return {
            state: false,
            message: "common.system.UNKNOWN_ERROR"
        }
    }

    


    return {
        state: false,
        message: "WAR"
    }
}

export const SignOutAction = async () => {
    AuthProvider.current().removeSession({writeCookie : await cookies()});

    return {}
}