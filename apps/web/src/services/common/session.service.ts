import { CookieService } from "@crepen-cdn/core/service";
import { CrepenAuthService } from "@web/lib/service/auth-service";
import { CrepenApiResponse } from "@web/lib/service/types/api";
import { CrepenToken } from "@web/lib/service/types/auth";
import { CrepenUser } from "@web/lib/service/types/user";
import { cookies } from "next/headers"

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
}