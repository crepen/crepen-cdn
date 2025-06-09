import { CookieService } from "@crepen-cdn/core/service";
import { CrepenAuthService } from "@web/lib/service/auth-service";
import { CrepenApiResponse } from "@web/lib/service/types/api";
import { CrepenToken } from "@web/lib/service/types/auth";
import { CrepenUser } from "@web/lib/service/types/user";
import { cookies } from "next/headers"
import { CrepenAuthApiService } from "../api/auth.api.service";

export class CrepenSessionService {

    private static TOKEN_COOKIE_KEY: string = 'crepen-tk';

    static getTokenData = async (): Promise<CrepenToken | undefined> => {

        const cookie = await cookies();
        const cookieData = cookie.get(this.TOKEN_COOKIE_KEY)?.value;

        const encryptTokenData = CookieService.decryptData<CrepenToken>(cookieData);

        return encryptTokenData;
    }

    static login = async (id?: string, password?: string): Promise<{ success: boolean, message?: string, data?: CrepenToken }> => {
        const cookieStore = await cookies();

        if (cookieStore.has('crepen-exp')) {
            cookieStore.delete('crepen-exp');
        }



        const loginToken: CrepenApiResponse<CrepenToken | undefined> = await CrepenAuthService.login(id, password);

        if (loginToken.success === false) {
            // throw new Error(loginToken.message);
            return {
                success: false,
                message: loginToken.message
            }
        }

        const tokenEncryptStr = CookieService.encrtypeData(loginToken.data);



        const loginUserData: CrepenApiResponse<CrepenUser | undefined> = await CrepenAuthService.getLoginUserData(loginToken.data?.accessToken);


        if (loginUserData.success === false) {
            return {
                success: false,
                message: loginUserData.message
            }
        }

        const userEncryptStr = CookieService.encrtypeData(loginUserData.data);


        if (cookieStore.has('crepen-tk')) {
            cookieStore.delete('crepen-tk');
        }


        cookieStore.set('crepen-tk', tokenEncryptStr, {
            expires: (loginToken.data?.expireTime ?? 1) * 1000,
            secure: process.env.NODE_ENV === 'development' ? false : true,
            httpOnly: process.env.NODE_ENV === 'development' ? false : true
        })

        if (cookieStore.has('crepen-tk-ex')) {
            cookieStore.delete('crepen-tk-ex');
        }

        cookieStore.set('crepen-tk-ex', ((loginToken.data?.expireTime ?? 0) * 1000).toString(), {
            expires: (loginToken.data?.expireTime ?? 1) * 1000,
            secure: process.env.NODE_ENV === 'development' ? false : true,
            httpOnly: process.env.NODE_ENV === 'development' ? false : true
        })


        if (cookieStore.has('crepen-usr')) {
            cookieStore.delete('crepen-usr');
        }

        cookieStore.set('crepen-usr', userEncryptStr, {
            secure: process.env.NODE_ENV === 'development' ? false : true,
            httpOnly: process.env.NODE_ENV === 'development' ? false : true
        })

        return {
            success: true,
        }
    }

    static applyToken = async (tokenGroup?: CrepenToken) => {
        const cookie = await cookies();

        if (tokenGroup === undefined) {
            cookie.delete(this.TOKEN_COOKIE_KEY);
        }
        else {
            const encryptData = CookieService.encrtypeData(tokenGroup)
            cookie.set(this.TOKEN_COOKIE_KEY, encryptData);
        }
    }

    static renewalToken = async (force?: boolean): Promise<{ success: boolean, data?: CrepenToken, message?: string }> => {
        const tokenGroup = await this.getTokenData();

        if (force === true) {
            // 강제 토큰 갱신

            console.log('RENEW-FORCE');

            const refData = await CrepenAuthApiService.refreshToken(tokenGroup?.refreshToken);

            if (refData.data !== undefined) {
                this.applyToken(refData.data);
                return {
                    success: true,
                    data: refData.data
                };
            }
            else {
                return {
                    success: false,
                    message: refData.message
                };
            }
        }
        else {
            // 토큰 만료 체크
            const isACTExpired = await CrepenAuthApiService.checkTokenExpired('access_token', tokenGroup?.accessToken);

            if (isACTExpired.statusCode === 401) {

                const refData = await CrepenAuthApiService.refreshToken(tokenGroup?.refreshToken);
 
                if (refData.data !== undefined) {
                    console.log('RENEW');
                    this.applyToken(refData.data);
                    return {
                        success: true,
                        data: refData.data
                    };
                }
                else {
                    return {
                        success: false,
                        message: refData.message
                    };
                }
            }
            else {
                console.log('RENEW-CANCEL' , isACTExpired);
                return {
                    success : true,
                    data : tokenGroup
                };
            }
        }
    }
}