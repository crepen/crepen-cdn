'use server'

import { StringUtil } from "../../../lib/util/string.util"
import { CrepenActionError } from "@web/modules/common-1/error/CrepenActionError";
import { AuthSessionProvider } from "../service/AuthSessionProvider";
import { CommonActionError } from "@web/modules/common/error/action/CommonActionError";
import { FileActionError } from "@web/modules/common/error/action/FileActionError";
import { ServerI18nProvider } from "../i18n/ServerI18nProvider";
import { FileDataService } from "@web/lib/modules/api-server/service/FileDataService";

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
    let sessionData = undefined;
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
                await ServerI18nProvider.getSystemTranslationText('action.file.REMOVE_FILE_UID_UNDEFINED'),
            )
        }

        await FileDataService.removeFile(uid, {
            token: sessionData.token?.accessToken
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

interface EditFileActionProp {
    uid?: string,
    isPubished?: boolean,
    fileTitle?: string
}

interface EditFileActionResult {
    success?: boolean,
    message?: string,
}

export const editFile = async (prop: EditFileActionProp): Promise<EditFileActionResult> => {


    let sessionData = undefined;

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


        if (StringUtil.isEmpty(prop?.uid)) {
            throw new FileActionError(
                await ServerI18nProvider.getSystemTranslationText('action.file.EDIT_FILE_UID_UNDEFINED'),
            )
        }

        try {
            await FileDataService.editFileData(prop?.uid, {
                fileTitle: prop.fileTitle,
                isPublished: prop.isPubished
            }, {
                token: sessionData?.token?.accessToken
            })

        }
        catch (e) {
            throw new FileActionError(
                !StringUtil.isEmpty((e as Error).message)
                    ? (e as Error).message
                    : await ServerI18nProvider.getSystemTranslationText('action.file.FAILED_EDIT_FILE'),
            )
        }




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

