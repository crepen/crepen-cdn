'use server'

import { CrepenSessionService } from "@web/services/common/session.service";



export const loginUser = async (currentState: any, formData: FormData): Promise<{ state?: boolean, message?: string }> => {

    let state: boolean = false;
    let message: string | undefined = undefined;

    try {

        const userId = formData.get('id')?.toString();
        const password = formData.get('password')?.toString();


        const requestLogin = await CrepenSessionService.login(userId,password);

        if(requestLogin.success === false){
            throw new Error(requestLogin.message);
        }


        state = true;
        message = 'success';
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
