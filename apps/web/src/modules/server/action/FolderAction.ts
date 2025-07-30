'use server'

import { AuthSessionProvider } from "../service/AuthSessionProvider";
import { StringUtil } from "@web/lib/util/string.util";
import { FolderActionError } from "@web/modules/common/error/action/FolderActionError";
import { ServerI18nProvider } from "../i18n/ServerI18nProvider";
import { BaseSystemError } from "@web/modules/common/error/BaseSystemError";
import { FolderDataService } from "@web/lib/modules/api-server/service/FolderDataService";

export const CrepenFolderAddChildFolder = async (formData: FormData) => {


    const newFolderTitle = formData.get('title')?.toString();
    const parentFolderUid = formData.get('parent-folder-uid')?.toString();


    try {

        await (await AuthSessionProvider.instance()).refresh();

        if(StringUtil.isEmpty(parentFolderUid)){
            throw new FolderActionError(await ServerI18nProvider.getSystemTranslationText('action.folder.PARENT_FOLDER_EMPTY'));
        }


        if(StringUtil.isEmpty(newFolderTitle)){
            throw new FolderActionError(await ServerI18nProvider.getSystemTranslationText('action.folder.FOLDER_TITLE_EMPTY'));
        }

        await FolderDataService.addFolder(parentFolderUid! , newFolderTitle!);


        return {
            success: true,
            lastValue: newFolderTitle
        }
    }
    catch (e) {
        if (e instanceof BaseSystemError) {
            return {
                success: false,
                message: e.message,
                lastValue: newFolderTitle
            }
        }

   

        return {
            success: false,
            message: await ServerI18nProvider.getSystemTranslationText('common.system.UNKNOWN_ERROR'),
            lastValue: newFolderTitle
        }
    }

}