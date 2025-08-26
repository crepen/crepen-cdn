'use server'

import { LocaleConfig } from "../config/LocaleConfig";
import { ServerLocaleInitializer } from "../module/locale/ServerLocaleInitializer";
import { RestUserDataService } from "../module/api-module/RestUserDataService";
import { ServerLocaleProvider } from "../module/locale/ServerLocaleProvider";
import { CustomActionError } from "../error/CustomActionError";
import { cookies } from "next/headers";
import { StringUtil } from "../util/StringUtil";
import { BaseApiResultEntity } from "../types/api/BaseApiResultEntity";
import { RestUserDataValidateCheckCategory } from "../types/api/dto/RestUserDto";
import { AuthProvider } from "../module/auth/AuthProvider";
import { RestAuthDataService } from "../module/api-module/RestAuthDataService";

interface AddUserActionResult {
    success: boolean,
    message?: string
}

export const AddUserAction = async (userId?: string, userPassword?: string, userName?: string, userEmail?: string): Promise<AddUserActionResult> => {

    const localeProv = ServerLocaleProvider.current(LocaleConfig);

    try {
        const cookie = await cookies();


        const locale = await (await ServerLocaleInitializer.current(LocaleConfig)).get({
            readCookie: cookie
        });

        // if (!StringUtil.isMatch(userPassword, checkPassword)) {
        //     throw new CustomActionError(await localeProv.translate('page.signup.message.error.password-not-match'))
        // }


        const res = await RestUserDataService.current(undefined, locale ?? LocaleConfig.defaultLocale)
            .addUser({
                userEmail: userEmail,
                userId: userId,
                userName: userName,
                userPassword: userPassword
            });

        if (!res.success) {
            throw new CustomActionError(res.message);
        }


        return {
            success: true,
            message: await localeProv.translate('page.signup.message.success')
        }
    }
    catch (e) {

        let message = await localeProv.translate('common.system.UNKNOWN_ERROR');

        if (e instanceof CustomActionError) {
            message = e.message;
        }

        return {
            success: false,
            message: message
        }
    }



}


export const FindIdAndPasswordAction = async (type: 'id' | 'password', emailOrId?: string) => {
    const localeProv = ServerLocaleProvider.current(LocaleConfig);
    try {
        const cookie = await cookies();


        const locale = await (await ServerLocaleInitializer.current(LocaleConfig)).get({
            readCookie: cookie
        });

        let res: BaseApiResultEntity = { success: false, statusCode: 500, timestamp: new Date().toString() };

        if (type === 'id') {
            res = await RestUserDataService.current(undefined, locale ?? LocaleConfig.defaultLocale)
                .findId(emailOrId ?? "#")
        }
        else {
            res = await RestUserDataService.current(undefined, locale ?? LocaleConfig.defaultLocale)
                .findPassword(emailOrId ?? "#", 'https://www.naver.com')
        }


        if (!res.success) {
            throw new CustomActionError(res.message);
        }


        return {
            success: true
        }
    }
    catch (e) {
        let message = await localeProv.translate('common.system.UNKNOWN_ERROR');

        if (e instanceof CustomActionError) {
            message = e.message;
        }

        return {
            success: false,
            message: message
        }
    }
}


export const EditUserAction = async (categories: RestUserDataValidateCheckCategory[], userName: string | undefined, userEmail: string | undefined) => {
    const localeProv = ServerLocaleProvider.current(LocaleConfig);

    try {


        const cookie = await cookies();


        const refreshTokenResult = await AuthProvider.current().refreshSession({ readCookie: cookie, writeCookie: cookie });

        if (!refreshTokenResult.state) {
            throw new CustomActionError(await localeProv.translate('common.system.UNAUTHORIZED'))
        }


        const locale = await (await ServerLocaleInitializer.current(LocaleConfig)).get({
            readCookie: cookie
        });

        const res = await RestUserDataService.current(refreshTokenResult.token, locale ?? LocaleConfig.defaultLocale)
            .editUserData(categories, {
                userEmail: userEmail,
                userName: userName,
            });

        if (!res.success) {
            throw new CustomActionError(res.message);
        }


        return {
            success: true,
            message: await localeProv.translate('page.main.profile.common.success.save')
        }
    }
    catch (e) {

        let message = await localeProv.translate('common.system.UNKNOWN_ERROR');

        if (e instanceof CustomActionError) {
            message = e.message;
        }

        return {
            success: false,
            message: message
        }
    }
}


export const GetSessionUserDataAction = async () => {
    const localeProv = ServerLocaleProvider.current(LocaleConfig);


    try {
        const cookie = await cookies();


        const refreshTokenResult = await AuthProvider.current().refreshSession({ readCookie: cookie, writeCookie: cookie });

        if (!refreshTokenResult.state) {
            throw new CustomActionError(await localeProv.translate('common.system.UNAUTHORIZED'))
        }


        const locale = await (await ServerLocaleInitializer.current(LocaleConfig)).get({
            readCookie: cookie
        });

        const res = await RestAuthDataService.current(refreshTokenResult.token, locale ?? LocaleConfig.defaultLocale)
            .getSignInUserData();

        if (!res.success) {
            throw new CustomActionError(res.message);
        }


        return {
            success: true,
            data: res.data
        }
    }
    catch (e) {

        let message = await localeProv.translate('common.system.UNKNOWN_ERROR');

        if (e instanceof CustomActionError) {
            message = e.message;
        }

        return {
            success: false,
            message: message
        }
    }
}