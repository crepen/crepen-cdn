'use server'

import { CrepenFolderOperationService } from "../../modules/crepen/explorer/folder/CrepenFolderOperationService";
import { CrepenActionError } from "../common/action-error";
import { CrepenAuthOpereationService } from "@web/services/operation/auth.operation.service";
import { CrepenCookieOperationService } from "@web/services/operation/cookie.operation.service";

interface AddFolderResult {
    success?: boolean,
    message?: string,
    lastValue?: string
}

export const addFolder = async (currentState: any, formData: FormData): Promise<AddFolderResult> => {
    const newFolderTitle = formData.get('folder-title')?.toString();
    const parentFolderUid = formData.get('parent-folder-uid')?.toString();


    try {

        const renewTokenGroup = await CrepenAuthOpereationService.renewToken();

        if (renewTokenGroup.success !== true) {
            return {
                success: false,
                message: renewTokenGroup.message
            };
        }
        else{
            await CrepenCookieOperationService.insertTokenData(renewTokenGroup.data);
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
        if (e instanceof CrepenActionError) {
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


