'use server'

import { CodePerformanceProvider } from "@web/modules/common/service/CodePerformanceProvider";
import { BaseSystemError } from "@web/modules/common/error/BaseSystemError";
import { AuthSessionProvider } from "../service/AuthSessionProvider";

interface LoginUserActionResult {
    success?: boolean,
    message?: string,
    lastValue?: {
        userId?: string,
        password?: string
    }
}

export const loginUser = async (currentState: unknown, formData: FormData): Promise<LoginUserActionResult> => {

    const perfo = CodePerformanceProvider.start();

    let result: LoginUserActionResult = {};

    const userId = formData.get('id')?.toString();
    const password = formData.get('password')?.toString();


    const authProv = await AuthSessionProvider.instance();

    try {
        await authProv.login(userId, password);

        result = {
            success: true
        }
    }
    catch (e) {
        if (e instanceof BaseSystemError) {
            result = {
                success: false,
                message: e.message,
                lastValue: {
                    userId: userId,
                    password: password
                }
            }
        }
        else {
            result = {
                success: false,
                message: '알 수 없는 오류입니다.',
                lastValue: {
                    userId: userId,
                    password: password
                }
            }
        }
    }


    console.log(`[PERFORMANCE] LoginAction.loginUser : ${perfo.end()}ms`);

    return result;
}
