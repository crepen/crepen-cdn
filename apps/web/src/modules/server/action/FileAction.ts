'use server'

import { StringUtil } from "../../../lib/util/string.util"
import { CrepenCookieOperationService } from "@web/services/operation/cookie.operation.service";
import { CrepenActionError } from "@web/modules/common-1/error/CrepenActionError";
import { CrepenAuthOpereationService } from "@web/modules/crepen/service/auth/CrepenAuthOpereationService";
import { CrepenFileOperationService } from "@web/modules/crepen/service/explorer/file/CrepenFileOperationService";
import { AuthSessionProvider } from "../service/AuthSessionProvider";
import { FileRouteError } from "@web/modules/common/error/route-error/FileRouteError";
import { CommonActionError } from "@web/modules/common/error/action/CommonActionError";
import { FileActionError } from "@web/modules/common/error/action/FileActionError";
import { ServerI18nProvider } from "../i18n/ServerI18nProvider";
import { FileDataService } from "@web/modules/api/service/FileDataService";

interface AddFileActionResult {
    success?: boolean,
    message?: string,
    addFileUid?: string
}

export const addFile = async (currentState: any, formData: FormData): Promise<AddFileActionResult> => {


    const title = formData.get('form-title')?.toString();
    const file = formData.get('form-file') as File
    const sharedOption = formData.get('form-option-shared');

    try {
        if (StringUtil.isEmpty(title)) {
            throw new CrepenActionError('title is required.');
        }

        if (file.size === 0) {
            throw new CrepenActionError('File is required');
        }

        return {
            success: true,
            addFileUid: "EEE",
            message: "Success"
        }
    }
    catch (e) {
        if (e instanceof CrepenActionError) {
            return {
                success: false,
                message: e.message
            }
        }
        else {
            return {
                success: false,
                message: "Unknown Error"
            }
        }





    }

}

export const removeFile = async (uid?: string) => {
    let sessionData;
    try {


        try {
            sessionData = (await (await AuthSessionProvider.instance()).refresh()).sessionData;
        }
        catch (e) {
            throw new FileActionError(
                await ServerI18nProvider.getSystemTranslationText('common.system.UNAUTHORIZATION'),
                {
                    innerError: e as Error
                }
            )
        }


        if (StringUtil.isEmpty(uid)) {
             throw new FileActionError(
                await ServerI18nProvider.getSystemTranslationText('common.system.REMOVE_FILE_UID_UNDEFINED'),
            )
        }

        await FileDataService.removeFile(uid , {
            token : sessionData.token?.accessToken
        })



        return {
            success: true
        }
    }
    catch (e) {
        if (e instanceof CommonActionError) {
            return {
                success: false,
                message: e.message
            }
        }

        return {
            success: false,
            message: await ServerI18nProvider.getSystemTranslationText("common.system.UNKNOWN_ERROR")
        }
    }
}

