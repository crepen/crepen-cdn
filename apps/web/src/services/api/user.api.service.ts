import { CrepenApiService } from "@web/lib/service/api-service";
import { CrepenApiResponse } from "@web/lib/service/types/api";
import { CrepenUser } from "@web/lib/service/types/user";

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