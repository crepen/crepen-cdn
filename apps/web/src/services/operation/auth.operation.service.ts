import { cookies } from "next/headers";
import { CrepenAuthApiService } from "../api/auth.api.service";
import { CrepenSessionService } from "../common/session.service"
import { CookieService } from "@crepen-cdn/core/service";
import { CrepenToken } from "@web/lib/service/types/auth";
import { BaseServiceResult } from "../types/common.service";

export class CrepenAuthOpereationService {

    static setCookieStoreTokenGroup = async (tokenGroup?: CrepenToken): Promise<BaseServiceResult> => {
        try {
            const cookie = await cookies();

            if (tokenGroup === undefined) {
                cookie.delete('crepen-tk');
            }
            else {
                
                const encryptData = CookieService.encrtypeData(tokenGroup)
                cookie.set('crepen-tk', encryptData);
            }

            return {
                success : true,
                message : 'Success',
            }
        }
        catch (e) {
            return {
                success: false,
                message: 'Token save failed.',
                innerError: e as Error
            }
        }

    }

    static getCookieStoreTokenGroup = async (): Promise<BaseServiceResult<CrepenToken | undefined>> => {
        try {
            const cookie = await cookies();
            const cookieData = cookie.get('crepen-tk')?.value;

            const encryptTokenData = CookieService.decryptData<CrepenToken>(cookieData);

            return {
                success: true,
                data: encryptTokenData,
                message: "Success"
            };
        }
        catch (e) {
            return {
                success: false,
                message: 'Token load failed',
                innerError: e as Error
            }
        }

    }

    static renewToken = async (isForce?: boolean): Promise<BaseServiceResult<CrepenToken | undefined>> => {
        let allowRenew = isForce ?? false;

        const tokenGroup = await this.getCookieStoreTokenGroup();

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

    static loginUser = async (id? : string , password? : string) : Promise<BaseServiceResult<CrepenToken | undefined>> => {
        return {
            success : false
        }
    }

    /** @deprecated */
    static rewriteToken = async () => {
        const tokenGroup = await CrepenSessionService.getTokenData();

        const accessTokenState = await CrepenAuthApiService.checkTokenExpired('access_token', tokenGroup?.accessToken);

        if (accessTokenState.statusCode === 200) {
            return tokenGroup;
        }

        const refreshTokenState = await CrepenAuthApiService.refreshToken(tokenGroup?.refreshToken);

        if (refreshTokenState.statusCode === 401) {
            return undefined;
        }
        else {
            const cookie = await cookies();


            return refreshTokenState.data;
        }
    }

    /** @deprecated */
    static checkTokenExpired = async (): Promise<boolean> => {
        return false;
    }

}