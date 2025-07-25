'use server'

import { CrepenCookieOperationService } from "@web/services/operation/cookie.operation.service";
import { CrepenActionError } from "@web/modules/common-1/error/CrepenActionError";
import { CrepenBaseError } from "@web/modules/common-1/error/CrepenBaseError";
import { CrepenFolderOperationService } from "@web/modules/crepen/service/explorer/folder/CrepenFolderOperationService";
import { AuthDataService } from "@web/modules/api/service/AuthDataService";

interface LoginUserActionResult {
    success?: boolean,
    message?: string,
    lastValue?: {
        userId?: string,
        password?: string
    }
}

export const loginUser = async (currentState: unknown, formData: FormData): Promise<LoginUserActionResult> => {

    const userId = formData.get('id')?.toString();
    const password = formData.get('password')?.toString();

    try {

        const request = await AuthDataService.login({
            id: userId,
            password: password
        })

        if (request.state === false) {
            throw new CrepenActionError(request.message);
        }



        const saveCookie = await CrepenCookieOperationService.insertTokenData({
            accessToken: request.accessToken ?? '',
            expireTime: request.expireTime ?? 0,
            refreshToken: request.refreshToken ?? ''
        });

        if (saveCookie.success !== true) {
            throw new CrepenActionError(saveCookie.message, saveCookie.statusCode, saveCookie.innerError)
        }

        // const randomString = StringUtil.randomString(10)
        // await CrepenCookieOperationService.setLoginUniqueString(randomString);



        const rootMenuData = await CrepenFolderOperationService.getRootFolder();

        if (rootMenuData.success === true) {
            await CrepenCookieOperationService.setRootFolderUid(rootMenuData.data?.uid ?? '');
        }


        return {
            success: true
        }
    }
    catch (e) {
        if (e instanceof CrepenBaseError) {
            return {
                success: false,
                message: e.message,
                lastValue: {
                    userId: userId,
                    password: password
                }
            }
        }

        return {
            success: false,
            message: '알 수 없는 오류입니다.',
            lastValue: {
                userId: userId,
                password: password
            }
        }
    }


}
