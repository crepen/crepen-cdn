import { CrepenUser } from "@web/services/types/object/user.object";
import { CrepenUserApiService } from "../api/user.api.service";
import { BaseServiceResult } from "../types/common.service";
import { CrepenCookieOperationService } from "./cookie.operation.service";

export class CrepenUserOperationService {

    static changePassword = async (currentPassword?: string, password?: string, confirmPassword?: string): Promise<BaseServiceResult> => {
        const tokenGroup = await CrepenCookieOperationService.getTokenData();

        const changePasswordRequest = await CrepenUserApiService.changePassword(tokenGroup.data?.accessToken, currentPassword, password, confirmPassword);

        return {
            success: changePasswordRequest.success ?? false,
            message: changePasswordRequest.message
        }

    }



    static getLoginUserData = async (): Promise<BaseServiceResult<CrepenUser | undefined>> => {

        const tokenGroup = await CrepenCookieOperationService.getTokenData();
        const getUserRequest = await CrepenUserApiService.getLoginUserData(tokenGroup.data?.accessToken);


        return {
            success: getUserRequest.success,
            data: getUserRequest.data,
            message: getUserRequest.message
        }
    }

}