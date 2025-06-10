import { CrepenUser } from "@web/lib/service/types/user";
import { CrepenAuthOpereationService } from "./auth.operation.service";
import { CrepenSessionService } from "../common/session.service";
import { CrepenUserApiService } from "../api/user.api.service";
import { BaseServiceResult } from "../types/common.service";

export class CrepenUserOperationService {

    static changePassword = async (currentPassword?: string, password?: string, confirmPassword?: string): Promise<BaseServiceResult> => {
        const tokenGroup = await CrepenAuthOpereationService.getCookieStoreTokenGroup();

        const changePasswordRequest = await CrepenUserApiService.changePassword(tokenGroup.data?.accessToken, currentPassword, password, confirmPassword);

        return {
            success: changePasswordRequest.success ?? false,
            message: changePasswordRequest.message
        }

    }

    /** @deprecated */
    static getUserData = async (token?: string): Promise<CrepenUser | undefined> => {
        return undefined;
    }

    static getLoginUserData = async (): Promise<BaseServiceResult<CrepenUser | undefined>> => {

        const tokenGroup = await CrepenAuthOpereationService.getCookieStoreTokenGroup();

        const getUserRequest = await CrepenUserApiService.getLoginUserData(tokenGroup.data?.accessToken);


        return {
            success: getUserRequest.success,
            data: getUserRequest.data,
            message: getUserRequest.message
        }
    }

}