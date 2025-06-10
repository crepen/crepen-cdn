import { CrepenApiService } from "@web/services/api/base.api.service";
import { CrepenApiResponse } from "@web/services/types/common.api";
import { CrepenUser } from "@web/services/types/user.object";

export class CrepenUserApiService {
    public static changePassword = async (token?: string, currentPassword?: string, password?: string, confirmPassword?: string): Promise<CrepenApiResponse<unknown>> => {
        return CrepenApiService.fetch<unknown>(
            'PUT', '/user/password',
            {
                currentPassword: currentPassword,
                newPassword: password,
                confirmPassword: confirmPassword
            },
            {
                token: token
            });
    }


    public static getLoginUserData = async (token?: string): Promise<CrepenApiResponse<CrepenUser>> => {
        return CrepenApiService.fetch<CrepenUser>(
            'GET', '/user',
            undefined,
            { token: token }
        )
    }
}