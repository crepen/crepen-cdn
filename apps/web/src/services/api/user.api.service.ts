import { CrepenApiResult } from "@web/modules/common-1/result/CrepenApiResult";
import { CrepenApiService } from "../../modules/common-1/CrepenApiService";
import { CrepenUser } from "@web/services/types/object/user.object";

export class CrepenUserApiService {
    public static changePassword = async (token?: string, currentPassword?: string, password?: string, confirmPassword?: string): Promise<CrepenApiResult<unknown>> => {
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


    public static getLoginUserData = async (token?: string): Promise<CrepenApiResult<CrepenUser>> => {
        return CrepenApiService.fetch<CrepenUser>(
            'GET', '/user',
            undefined,
            { token: token }
        )
    }
}