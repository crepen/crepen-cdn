'use server'

import { CrepenCookieOperationService } from "@web/services/operation/cookie.operation.service";
import { CrepenFolderOperationService } from "../CrepenFolderOperationService";
import { CrepenActionError } from "@web/modules/common-1/error/CrepenActionError";
import { CrepenBaseError } from "@web/modules/common-1/error/CrepenBaseError";
import { CrepenAuthOpereationService } from "../../../auth/CrepenAuthOpereationService";

export const CrepenFolderAddChildFolder = async (formData: FormData) => {


    const newFolderTitle = formData.get('title')?.toString();
    const parentFolderUid = formData.get('parent-folder-uid')?.toString();


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




        const requestAddFolder = await CrepenFolderOperationService.addFolder(parentFolderUid, newFolderTitle);

        if (requestAddFolder.success !== true) {
            throw new CrepenActionError(requestAddFolder.message);
        }



        return {
            success: true,
            message: requestAddFolder.message,
            lastValue: newFolderTitle
        }
    }
    catch (e) {
        if (e instanceof CrepenBaseError) {
            return {
                success: false,
                message: e.message,
                lastValue: newFolderTitle
            }
        }

        return {
            success: false,
            message: '알 수 없는 오류입니다.',
            lastValue: newFolderTitle
        }
    }

}