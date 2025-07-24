'use server'

import { StringUtil } from "../util/string.util"
import { CrepenCookieOperationService } from "@web/services/operation/cookie.operation.service";
import { CrepenActionError } from "@web/modules/common/error/CrepenActionError";
import { CrepenAuthOpereationService } from "@web/modules/crepen/service/auth/CrepenAuthOpereationService";
import { CrepenFileOperationService } from "@web/modules/crepen/service/explorer/file/CrepenFileOperationService";

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


    try {
        const renewTokenGroup = await CrepenAuthOpereationService.renewToken();

        if (renewTokenGroup.success !== true) {
            return {
                success: false,
                message: renewTokenGroup.message
            };
        }
        else {
            await CrepenCookieOperationService.insertTokenData(renewTokenGroup.data ?? undefined);
        }



        if (StringUtil.isEmpty(uid)) {
            throw new CrepenActionError('REMOVE FILE UID NOT DEFINED' , 403);
        }


        const removeRequest = await CrepenFileOperationService.removeFile(uid!);

        if (removeRequest.success !== true) {
            throw new CrepenActionError(removeRequest.message , removeRequest.statusCode , removeRequest.innerError);
        }



        return {
            success: true,
            message: removeRequest.message
        }
    }
    catch (e) {
        if (e instanceof CrepenActionError) {
            return {
                success: false,
                message: e.message
            }
        }

        return {
            success: false,
            message: '알 수 없는 오류입니다.'
        }
    }
}

