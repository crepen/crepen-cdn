'use server'

import { CrepenActionError } from "../common/action-error";
import { CrepenAuthOpereationService } from "@web/services/operation/auth.operation.service";

interface LoginUserActionResult {
    success?: boolean,
    message?: string,
    lastValue?: {
        userId?: string,
        password?: string
    }
}

export const loginUser = async (currentState: unknown, formData: FormData): Promise<LoginUserActionResult> => {

    const userId = formData.get('id')?.toString();
    const password = formData.get('password')?.toString();

    try {
        // const requestLogin = await CrepenSessionService.login(userId, password);
        const requestLogin = await CrepenAuthOpereationService.loginUser(userId, password);

        if (requestLogin.success === false) {
            throw new CrepenActionError(requestLogin.message);
        }


        return {
            success : true
        }
    }
    catch (e) {
        if (e instanceof CrepenActionError) {
            return {
                success: false,
                message: e.message,
                lastValue: {
                    userId: userId,
                    password: password
                }
            }
        }

        return {
            success: false,
            message: '알 수 없는 오류입니다.',
            lastValue: {
                userId: userId,
                password: password
            }
        }
    }

   
}
