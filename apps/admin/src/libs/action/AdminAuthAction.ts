'use server'

import { cookies } from "next/headers"
import { LocaleProvider } from "../../modules/locale-module/LocaleProvider"
import { SessionProvider } from "../../modules/session/SessionProvider"
import { StringUtil } from "../util/StringUtil"
import { RestSessionUser } from "../../modules/server-data/types/entity/RestAuthType"
import { CrepenActionError } from "../error/common/CrepenActionError"
import { RestAdminAuthData } from "../../modules/server-data/RestAdminAuthData"

interface SignInActionResult {
    success: boolean,
    message?: string
}

export const SignInAction = async (id?: string, password?: string): Promise<SignInActionResult> => {

    const localeProv = LocaleProvider.getInstance();


    if (StringUtil.isEmpty(id) || StringUtil.isEmpty(password)) {
        return {
            success: false,
            message: localeProv.translate('ADMIN.SIGNIN.COMMON.ID_OR_PASSWORD_UNDEFINED')
        }
    }

    const sessionProv = SessionProvider.instance(await cookies());

    const res = await sessionProv.signIn(id, password);


    if (res.success) {
        return {
            success: true
        }
    }
    else {
        return {
            success: false,
            message: res.message
        }
    }



}


// interface SignInUserActionResult {
//     success: boolean,
//     data?: RestSessionUser,
//     message?: string
// }

// export const SignInUserDataAction = async (): Promise<SignInUserActionResult> => {

//     const localeProv = LocaleProvider.getInstance();

//     try {

//         const restProv = new RestAdminAuthData(process.env.API_URL);

//         restProv.getSessionUserData()


//         return {
//             success: true,
//             message: localeProv.translate('COMMON.SUCCESS')
//         }
//     }
//     catch (e) {

//         let message: string = '';
//         if (e instanceof CrepenActionError) {
//             message = localeProv.translate(e.message)
//         }
//         else {
//             message = localeProv.translate('COMMON.UNKNOWN_ERROR');
//         }

//         return {
//             success: false,
//             message: message
//         }
//     }
// }


interface ChangeInitAccountPasswordActionResult {
    success: boolean,
    message?: string
}

export const ChangeInitAccountPasswordAction = async (password?: string): Promise<ChangeInitAccountPasswordActionResult> => {
    const localeProv = LocaleProvider.getInstance();

    try {
        const restProv = new RestAdminAuthData(process.env.API_URL);
        const sessionProv = SessionProvider.instance(await cookies());
        const session = await sessionProv.getSession();

        if (StringUtil.isEmpty(password)) {
            throw new CrepenActionError(
                "ADMIN.SIGNIN.INIT_ACCOUNT.CHANGE_PASSWORD_UNDEFINED",
                403,
                localeProv.translate("ADMIN.SIGNIN.INIT_ACCOUNT.CHANGE_PASSWORD_UNDEFINED")
            )
        }

        const res = await restProv.changeInitAccountPassword(session.token?.act, password);

        if(res.success){
            await sessionProv.clearSession();
        }

        return {
            success: res.success,
            message: res.message
        }
    }
    catch (e) {
        let message: string = '';
        if (e instanceof CrepenActionError) {
            message = localeProv.translate(e.message)
        }
        else {
            message = localeProv.translate('COMMON.UNKNOWN_ERROR');
        }

        return {
            success: false,
            message: message
        }
    }


}