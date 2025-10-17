'use server'

import { DatabaseEntity } from "@web/types/DatabaseEntity";
import { cookies } from "next/headers";
import { LocaleProvider } from "../../modules/locale-module/LocaleProvider";
import { SessionProvider } from "../../modules/session/SessionProvider";
import { CrepenActionError } from "../error/common/CrepenActionError";
import { RestAdminPropertyData } from "../../modules/server-data/RestAdminPropertyData";

export const updateDatabaseAction = async (databaseEntity?: DatabaseEntity) => {
    const localeProv = LocaleProvider.getInstance();

    try {
        const restProv = RestAdminPropertyData.init(process.env.API_URL);
        const sessionProv = SessionProvider.instance(await cookies());
        const session = await sessionProv.getSession();

        

        const res = await restProv.updateDatabase(session.token?.act , databaseEntity);

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