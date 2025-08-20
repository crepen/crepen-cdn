'use server'

import { cookies } from "next/headers"
import { RestExplorerDataService } from "../module/api-module/RestExplorerDataService"
import { AuthProvider } from "../module/auth/AuthProvider"
import { ServerLocaleInitializer } from "../module/locale/ServerLocaleInitializer"
import { LocaleConfig } from "../config/LocaleConfig"
import { CustomActionError } from "../error/CustomActionError"
import { ServerLocaleProvider } from "../module/locale/ServerLocaleProvider"

interface AddFolderActionResult {
    success: boolean,
    uid?: string,
    message?: string
}

export const AddFolderAction = async (parentFolderUid: string, folderName: string): Promise<AddFolderActionResult> => {
    const localeProv = ServerLocaleProvider.current(LocaleConfig);

    try {

        const refreshTokenResult = await AuthProvider.current().refreshSession();

        if (!refreshTokenResult.state) {
            throw new CustomActionError(await localeProv.translate('common.system.UNAUTHORIZED'))
        }


        const locale = await (await ServerLocaleInitializer.current(LocaleConfig)).get({
            readCookie: await cookies()
        });

        const requestResult = await RestExplorerDataService.current(refreshTokenResult?.token, locale ?? LocaleConfig.defaultLocale)
            .addFolder(parentFolderUid, folderName);

        console.log(requestResult);

        if (!requestResult.success) {
            throw new CustomActionError(requestResult.message);
        }

        return {
            success: true,
            uid: requestResult.data?.folderUid
        }
    }
    catch (e) {
        let message: string | undefined = await localeProv.translate('common.system.UNKNOWN_ERROR');

        if (e instanceof CustomActionError) {
            message = e.message;
        }

        return {
            success: false,
            message: message
        }
    }
}