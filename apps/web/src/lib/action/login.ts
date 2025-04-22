'use server'

import { cookies } from "next/headers";
import { CookieService } from "@crepen-cdn/core/service";
import { DateTime } from 'luxon';

export const  loginUser = async (currentState: any ,formData : FormData) : Promise<{state? : boolean , message? : string }> => {

    let state : boolean = false;
    let message : string | undefined = undefined;

    try{
        const cookieStore = await cookies();

        if(cookieStore.has('crepen-exp')){
            cookieStore.delete('crepen-exp');
        }
        

        const userId = formData.get('uid')?.toString();


        if(userId !== 'admin'){
            throw new Error('uid incorrect')
        }

        

        const cookieData = CookieService.decryptData(cookieStore.get('crepen-uif')?.value);
        const expireTime = DateTime.now().plus({minute : 30}).toMillis();

        cookieData.user =  {
            loginExpireTime : expireTime,
            uid : userId
        };

        const cookieDataStr = CookieService.encrtypeData(cookieData);
    
        cookieStore.set('crepen-uif',cookieDataStr , {
            httpOnly : true,
            secure : true
        });

        cookieStore.set('crepen-exp' ,expireTime .toString() , {
            httpOnly : true,
            expires : expireTime,
            secure : true
        });
    
        state = true;
        message = 'success';
    }
    catch(e){
        state = false;
        message = 'unknown error';
        if(e instanceof Error){
            message = e.message
        }
    }



    if(state === true){
        
    }


    return {
        state : state,
        message : message
    }
    
}

export const logoutUser = async () => {
    const cookieStore = await cookies();
    const cookieData = CookieService.decryptData(cookieStore.get('crepen-uif')?.value);

    cookieData.user = {};

    const rewriteCookieData = CookieService.encrtypeData(cookieData);
    cookieStore.set('crepen-uif' , rewriteCookieData , {
        httpOnly : true,
        secure : true
    });
    cookieStore.delete('crepen-exp');
}