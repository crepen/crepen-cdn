'use server'

import { CrepenUserApiService } from "@web/services/api/user.api.service"
import { CrepenSessionService } from "@web/services/common/session.service";
import { CrepenUserOperationService } from "@web/services/operation/user.operation.service";
import { cookies } from "next/headers";


export const changePasswordAction = async (currentState: any, formData: FormData): Promise<{ success?: boolean, message?: string }> => {
    try {
        // const requestChangePassword = await CrepenUserApi.changePassword(token?.accessToken ?? '' , formData.get('new-password')?.toString())

        const changePasswordResult = await CrepenUserOperationService.changePassword(formData.get('new-password')?.toString());

        


        return {
            success: changePasswordResult.success,
            message: changePasswordResult.success === false ? changePasswordResult.message : undefined
        }
    }
    catch (e) {
        return {
            success: false,
            message: '알 수 없는 오류입니다.'
        }
    }

    return {
        success: true,
        message: ''
    }
}