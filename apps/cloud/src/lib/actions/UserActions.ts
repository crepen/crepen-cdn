'use server'

import { LocaleConfig } from "../config/LocaleConfig";
import { ServerLocaleInitializer } from "../module/locale/ServerLocaleInitializer";
import { RestUserDataService } from "../module/api-module/RestUserDataService";
import { ServerLocaleProvider } from "../module/locale/ServerLocaleProvider";
import { CustomActionError } from "../error/CustomActionError";
import { cookies } from "next/headers";

interface AddUserActionResult {
    success: boolean,
    message?: string
}

export const AddUserAction = async (userId?: string, userPassword?: string, userName?: string, userEmail?: string, checkPassword?: string): Promise<AddUserActionResult> => {

const localeProv = ServerLocaleProvider.current(LocaleConfig);

    try {
        const cookie = await cookies();
        

        const locale = await (await ServerLocaleInitializer.current(LocaleConfig)).get({
            readCookie: cookie
        });

        const res = await RestUserDataService.current(undefined,  locale ?? LocaleConfig.defaultLocale)
            .addUser({
                userEmail : userEmail,
                userId : userId,
                userName : userName,
                userPassword : userPassword
            });

        if(!res.success){
            throw new CustomActionError(res.message);
        }


        return {
            success: true,
            message : await localeProv.translate('page.signup.success')
        }
    }
    catch (e) {

        let message = await localeProv.translate('common.system.UNKNOWN_ERROR');

        if(e instanceof CustomActionError){
            message = e.message;
        }

        return {
            success: false,
            message: message
        }
    }



}