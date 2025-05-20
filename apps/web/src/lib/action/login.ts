'use server'

import { cookies, headers } from "next/headers";
import { CookieService } from "@crepen-cdn/core/service";
import { CrepenToken } from "../service/types/auth";
import { CrepenAuthService } from "../service/auth-service";
import { CrepenApiResponse } from "../service/types/api";
import { CrepenUser } from "../service/types/user";
import { redirect } from "next/navigation";



export const loginUser = async (currentState: any, formData: FormData): Promise<{ state?: boolean, message?: string }> => {

    let state: boolean = false;
    let message: string | undefined = undefined;

    try {
        const cookieStore = await cookies();

        if (cookieStore.has('crepen-exp')) {
            cookieStore.delete('crepen-exp');
        }
        console.log('stttt');

        const userId = formData.get('id')?.toString();
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




        // redirect('/')
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
