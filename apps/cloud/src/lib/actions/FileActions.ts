'use server'

import { cookies } from "next/headers";
import { LocaleConfig } from "../config/LocaleConfig";
import { ServerLocaleInitializer } from "../module/locale/ServerLocaleInitializer";
import { AuthProvider } from "../module/auth/AuthProvider";
import { RestExplorerDataService } from "../module/api-module/RestExplorerDataService";
import { CustomActionError } from "../error/CustomActionError";
import { ServerLocaleProvider } from "../module/locale/ServerLocaleProvider";

export const UploadFileAction = async (uploadFile: File, parentFolderUid: string): Promise<{ success: boolean, message?: string }> => {

    const localeProv = await ServerLocaleProvider.current(LocaleConfig);

    try {

        throw new Error();

        const locale = await (await ServerLocaleInitializer.current(LocaleConfig)).get({
            readCookie: await cookies()
        });

        const session = await AuthProvider.current().getSession({
            readCookie: await cookies()
        });

        const restProv = RestExplorerDataService.current(session?.token, locale ?? LocaleConfig.defaultLocale);

        const uploadFileRes = await restProv.uploadFile(uploadFile, parentFolderUid);


        if (uploadFileRes.success) {
            return {
                success: false
            }
        }

        throw new CustomActionError(uploadFileRes.message);
    }
    catch (e) {
        if (e instanceof CustomActionError) {
            return {
                success: false,
                message: e.message
            }
        }
        else {
            return {
                success: false,
                message: await localeProv.translate('common.system.unknown_error')
            }
        }
    }

}


export const UpdateFilePublishStateAction = async (fileUid: string, state: boolean) => {

    const localeProv = await ServerLocaleProvider.current(LocaleConfig);

    try {
        const locale = await (await ServerLocaleInitializer.current(LocaleConfig)).get({
            readCookie: await cookies()
        });

        const session = await AuthProvider.current().getSession({
            readCookie: await cookies()
        });

        const uploadFileRes = await RestExplorerDataService
            .current(session?.token, locale ?? LocaleConfig.defaultLocale)
            .updateFilePublishedState(fileUid, state);


        if (uploadFileRes.success) {
            return {
                success: true
            }
        }

        throw new CustomActionError(uploadFileRes.message);

    }
    catch (e) {
        console.log(e);

        if (e instanceof CustomActionError) {
            return {
                success: false,
                message: e.message
            }
        }
        else {
            return {
                success: false,
                message: await localeProv.translate('common.system.unknown_error')
            }
        }
    }


}


export const UpdateFileCryptAction = async (fileUid: string, updateState: boolean) => {
    const localeProv = await ServerLocaleProvider.current(LocaleConfig);

    try {
        const locale = await (await ServerLocaleInitializer.current(LocaleConfig)).get({
            readCookie: await cookies()
        });

        const session = await AuthProvider.current().getSession({
            readCookie: await cookies()
        });

         const updateCrypt = await RestExplorerDataService
            .current(session?.token, locale ?? LocaleConfig.defaultLocale)
            .cryptFile(fileUid , updateState)

        if (updateCrypt.success) {
            return {
                success: true
            }
        }

        throw new CustomActionError(updateCrypt.message);
    }
    catch (e) {
        console.log(e);

        if (e instanceof CustomActionError) {
            return {
                success: false,
                message: e.message
            }
        }
        else {
            return {
                success: false,
                message: await localeProv.translate('common.system.unknown_error')
            }
        }
    }
}