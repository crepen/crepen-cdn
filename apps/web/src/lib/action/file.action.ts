'use server'

import { CrepenHttpService } from "@web/services/common/http.service";
import { CrepenActionError } from "../common/action-error";
import { StringUtil } from "../util/string.util"
import { Readable } from "stream";
import { CrepenApiService } from "@web/services/api/base.api.service";

interface AddFileActionResult {
    success?: boolean,
    message?: string,
    addFileUid?: string
}

export const addFile = async (currentState: any, formData: FormData): Promise<AddFileActionResult> => {


    const title = formData.get('form-title')?.toString();
    const file = formData.get('form-file') as File
    const sharedOption = formData.get('form-option-shared');

    console.log('================================')
    console.log('TITLE', title);
    console.log('FILE', file);
    console.log('OPTION_SHARED', sharedOption);
    console.log('================================')




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

