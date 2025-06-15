import { CrepenAuthApiService } from "../api/auth.api.service";
import { CrepenToken } from "@web/services/types/object/auth.object";
import { BaseServiceResult } from "../types/common.service";
import { CrepenCookieOperationService } from "./cookie.operation.service";
import { CrepenUserOperationService } from "./user.operation.service";
import { CrepenCommonError } from "@web/lib/common/common-error";
import { CrepenServiceError } from "@web/lib/common/service-error";

export class CrepenAuthOpereationService {

    static renewToken = async (isForce?: boolean): Promise<BaseServiceResult<CrepenToken | undefined>> => {
        let allowRenew = isForce ?? false;

        const tokenGroup = await CrepenCookieOperationService.getTokenData();

        if (allowRenew === false) {
            const checkTokenRequest = await CrepenAuthApiService.checkTokenExpired('access_token', tokenGroup.data?.accessToken)

            if (checkTokenRequest.success === false) allowRenew = true;
        }

        if (allowRenew === true) {
            const refreshTokenRequest = await CrepenAuthApiService.refreshToken(tokenGroup.data?.refreshToken);

            if (!refreshTokenRequest.success) {
                return {
                    success: false,
                    message: refreshTokenRequest.message
                }
            }

            return {
                success: true,
                data: refreshTokenRequest.data,
                message: refreshTokenRequest.message
            }
        }

        return {
            success: true,
            data: tokenGroup.data
        }
    }

    static loginUser = async (id?: string, password?: string): Promise<BaseServiceResult<CrepenToken | undefined>> => {

        try {
            const loginToken = await CrepenAuthApiService.loginUser(id, password);
            if (loginToken.success !== true) {
                throw new CrepenServiceError(loginToken.message)
            }


            const insertCookie = await CrepenCookieOperationService.insertTokenData(loginToken.data);
            if (insertCookie.success !== true) {
                throw new CrepenServiceError(insertCookie.message, insertCookie.innerError)
            }



            const loginUserData = await CrepenUserOperationService.getLoginUserData();
            if (loginUserData.success !== true) {
                throw new CrepenServiceError(loginUserData.message, loginUserData.innerError)
            }

            return {
                success: true
            }
        }
        catch (e) {
            if (e instanceof CrepenCommonError) {
                return {
                    success: false,
                    message: e.message,
                    innerError: e
                }
            }

            return {
                success: false,
                message: 'Unknown Error',
                innerError: e as Error
            }
        }

    }




}