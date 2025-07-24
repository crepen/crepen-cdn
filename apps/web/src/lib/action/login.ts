'use server'

import { CrepenCookieOperationService } from "@web/services/operation/cookie.operation.service";
import { CrepenActionError } from "@web/modules/common/error/CrepenActionError";
import { CrepenBaseError } from "@web/modules/common/error/CrepenBaseError";
import { CrepenAuthOpereationService } from "@web/modules/crepen/service/auth/CrepenAuthOpereationService";
import { CrepenFolderOperationService } from "@web/modules/crepen/service/explorer/folder/CrepenFolderOperationService";

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
        // const requestLogin = await CrepenSessionService.login(userId, password);
        const requestLogin = await CrepenAuthOpereationService.loginUser(userId, password);

        if (requestLogin.success === false) {
            throw new CrepenActionError(requestLogin.message);
        }


        const saveCookie = await CrepenCookieOperationService.insertTokenData(requestLogin.data ?? undefined);

        if (saveCookie.success !== true) {
            throw new CrepenActionError(saveCookie.message, saveCookie.statusCode , saveCookie.innerError)
        }

        // const randomString = StringUtil.randomString(10)
        // await CrepenCookieOperationService.setLoginUniqueString(randomString);



        const rootMenuData = await CrepenFolderOperationService.getRootFolder();

        if(rootMenuData.success === true){
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
