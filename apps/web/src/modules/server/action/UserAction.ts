'use server'

import { CrepenUserOperationService } from "@web/services/operation/user.operation.service";
import { StringUtil } from "../../../lib/util/string.util";
import { CrepenCookieOperationService } from "@web/services/operation/cookie.operation.service";
import { CrepenActionError } from "@web/modules/common-1/error/CrepenActionError";
import { CrepenAuthOpereationService } from "@web/modules/crepen/service/auth/CrepenAuthOpereationService";


interface ChangePasswordActionResult {
    success?: boolean,
    message?: string,
    lastValue?: {
        currentPassword?: string,
        newPassword?: string,
        confirmPassword?: string
    }
}


export const changePasswordAction = async (currentState: any, formData: FormData): Promise<ChangePasswordActionResult> => {

    const currentPassword = formData.get('current-password')?.toString();
    const newPassword = formData.get('new-password')?.toString();
    const confirmPassword = formData.get('confirm-password')?.toString();

    try {
        const tokenGroup = await CrepenCookieOperationService.getTokenData();

        if (!tokenGroup.success) {
            throw new CrepenActionError(tokenGroup.message);
        }


        if (StringUtil.isEmpty(currentPassword)) {
            throw new CrepenActionError('Current password is required.');
        }

        if (!StringUtil.isMatch(newPassword, confirmPassword)) {
            throw new CrepenActionError('New password and confirm password not match.');
        }


        const renewalTokenResult = await CrepenAuthOpereationService.renewToken(true);
        if(!renewalTokenResult.success){
            throw new CrepenActionError('Session Expired.');
        }

        const cookieStoreResult = await CrepenCookieOperationService.insertTokenData(renewalTokenResult.data ?? undefined);
        if(!cookieStoreResult.success){
            throw new CrepenActionError('Session store failed.')
        }


        const changePasswordResult = await CrepenUserOperationService.changePassword(currentPassword, newPassword, confirmPassword);

        if(!changePasswordResult.success){
            throw new CrepenActionError(changePasswordResult.message);
        }

        return {
            success: true,
            message: changePasswordResult.message
        }
    }
    catch (e) {
        if (e instanceof CrepenActionError) {
            return {
                success: false,
                message: e.message,
                lastValue : {
                    currentPassword : currentPassword,
                    newPassword : newPassword,
                    confirmPassword : confirmPassword
                }
            }
        }
        else {
            return {
                success: false,
                message: '알 수 없는 오류입니다.'
            }
        }
    }

    
}