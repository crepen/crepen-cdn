'use server'

import { cookies, headers } from "next/headers";
import { CookieService } from "@crepen-cdn/core/service";
import { DateTime } from 'luxon';
import mysql from 'mysql2/promise'
import { CrepenUserService } from "../service/user-service";
import { CrepenToken } from "../service/types/auth";
import { CrepenAuthService } from "../service/auth-service";
import { CrepenApiResponse } from "../service/types/api";
import { CrepenUser } from "../service/types/user";
import { StringUtil } from "../util/string.util";
import { redirect } from "next/navigation";
import { CommonUtil } from "../util/common.util";



export const loginUser = async (currentState: any, formData: FormData): Promise<{ state?: boolean, message?: string }> => {

    let state: boolean = false;
    let message: string | undefined = undefined;

    try {

        
        // await CommonUtil.delay(10000)


        console.log((await headers()).get('next-url'));

        const cookieStore = await cookies();

        if (cookieStore.has('crepen-exp')) {
            cookieStore.delete('crepen-exp');
        }


        const userId = formData.get('username')?.toString();
        const password = formData.get('password')?.toString();


        const loginToken: CrepenApiResponse<CrepenToken | undefined> = await CrepenAuthService.login(userId, password);

        if (loginToken.success === false) {
            throw new Error(loginToken.message);
        }


        const tokenEncryptStr = CookieService.encrtypeData(loginToken.data);



        const loginUserData: CrepenApiResponse<CrepenUser | undefined> = await CrepenAuthService.getLoginUserData(loginToken.data?.accessToken);


        if (loginUserData.success === false) {
            throw new Error(loginUserData.message);
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

        state = true;
        message = 'success';


        // redirect()
    }
    catch (e) {
        state = false;
        message = 'unknown error';
        if (e instanceof Error) {
            message = e.message
        }
    }

    return {
        state: state,
        message: message
    }

}

export const logoutUser = async () => {
    const cookieStore = await cookies();

    if (cookieStore.has('crepen-tk')) {
        cookieStore.delete('crepen-tk');
    }

    if (cookieStore.has('crepen-tk-ex')) {
        cookieStore.delete('crepen-tk-ex');
    }

    if (cookieStore.has('crepen-usr')) {
        cookieStore.delete('crepen-usr');
    }
}