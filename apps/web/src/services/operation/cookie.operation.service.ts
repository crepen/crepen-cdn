import { cookies } from "next/headers";
import { CrepenToken } from "../types/object/auth.object"
import { BaseServiceResult } from "../types/common.service";
import { CrepenCryptoUtil } from "@web/lib/util/crypto.util";
import { StringUtil } from "@web/lib/util/string.util";
import { CrepenServiceError } from "@web/lib/common/service-error";
import { CrepenCommonError } from "@web/lib/common/common-error";

export class CrepenCookieOperationService {

    private static readonly TOKEN_COOKIE_KEY = 'crepen-tk'


    static insertTokenData = async (tokenGroup?: CrepenToken): Promise<BaseServiceResult> => {

        try {
            const cookie = await cookies();


            //ENCRYPT
            const tokenSecretKey = this.getTokenSecretKey();

            if (tokenGroup === undefined) {
                cookie.delete(this.TOKEN_COOKIE_KEY);
                return {
                    success: true
                }
            }


            const encryptStr = CrepenCryptoUtil.encrypt(JSON.stringify(tokenGroup), tokenSecretKey ?? 'token-secret-key');

            if (StringUtil.isEmpty(encryptStr)) {
                throw new CrepenServiceError('Encrypt Error');
            }

            cookie.set(this.TOKEN_COOKIE_KEY, encryptStr!);



            return {
                success: true,
                message: 'Success'
            }
        }
        catch (e) {



            if (e instanceof CrepenCommonError) {
                return {
                    success: false,
                    message: e.message
                }
            }

            return {
                success: false,
                message: 'Unknown Error',
                innerError: e as Error
            }
        }

    }

    static getTokenData = async (): Promise<BaseServiceResult<CrepenToken | undefined>> => {
        try {
            const cookie = await cookies();
            const cookieData = cookie.get(this.TOKEN_COOKIE_KEY)?.value;

            //DECRYPT
            const tokenSecretKey = this.getTokenSecretKey();
            const decryptStr = CrepenCryptoUtil.decrypt(cookieData, tokenSecretKey ?? 'token-secret-key');

            if(decryptStr === undefined){
                throw new CrepenServiceError('Cookie Service Error');
            }

            const tokenObj : CrepenToken = JSON.parse(decryptStr ?? '')

            return {
                success: true,
                data: tokenObj
            };
        }
        catch (e) {
            if (e instanceof CrepenCommonError) {
                return {
                    success: false,
                    message: e.message
                }
            }

            return {
                success: false,
                message: 'Unknown Error',
                innerError: e as Error
            }
        }

    }


    private static getTokenSecretKey = (): string | undefined => {
        return process.env.AUTH_SECRET;
    };






}