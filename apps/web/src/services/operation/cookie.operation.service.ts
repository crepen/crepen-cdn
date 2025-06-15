import { cookies } from "next/headers";
import { CrepenToken } from "../types/object/auth.object"
import { BaseServiceResult } from "../types/common.service";
import { CrepenCryptoUtil } from "@web/lib/util/crypto.util";
import { StringUtil } from "@web/lib/util/string.util";
import { CrepenServiceError } from "@web/lib/common/service-error";
import { CrepenCommonError } from "@web/lib/common/common-error";
import { NextRequest, NextResponse } from "next/server";
import { ReadonlyRequestCookies, ResponseCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
import * as DateFns from 'date-fns';

export class CrepenCookieOperationService {

    private static readonly TOKEN_COOKIE_KEY = 'CPTN'
    private static getTokenSecretKey = (): string | undefined => {
        return process.env.AUTH_SECRET;
    };

    //#region INSERT_TOKEN

    private static baseInsertTokenData = async (tokenGroup: CrepenToken | undefined, cookieFunc: ReadonlyRequestCookies | ResponseCookies): Promise<BaseServiceResult> => {
        try {
            const cookie = cookieFunc;
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

            cookie.delete(this.TOKEN_COOKIE_KEY);
            cookie.set(this.TOKEN_COOKIE_KEY, encryptStr!, {
                secure: process.env.NODE_ENV === 'development' ? false : true,
                httpOnly: process.env.NODE_ENV === 'development' ? false : true,
            });

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

    static insertTokenData = async (tokenGroup?: CrepenToken): Promise<BaseServiceResult> => {
        return await this.baseInsertTokenData(tokenGroup, await cookies())
    }

    static insertTokenDataInEdge = async (res: NextResponse, tokenGroup?: CrepenToken): Promise<BaseServiceResult> => {
        res.cookies.set('gwgw', '???')
        return await this.baseInsertTokenData(tokenGroup, res.cookies);
    }

    //#endregion

    //#region GET_TOKEN

    private static baseGetTokenData = async (cookieFunc: ReadonlyRequestCookies | RequestCookies): Promise<BaseServiceResult<CrepenToken | undefined>> => {
        try {
            const cookieData = cookieFunc.get(this.TOKEN_COOKIE_KEY)?.value;

            //DECRYPT
            const tokenSecretKey = this.getTokenSecretKey();
            const decryptStr = CrepenCryptoUtil.decrypt(cookieData, tokenSecretKey ?? 'token-secret-key');

            if (decryptStr === undefined) {
                throw new CrepenServiceError('Cookie Service Error');
            }

            let tokenObj: CrepenToken | undefined = undefined;

            try {
                tokenObj = JSON.parse(decryptStr ?? '')
            }
            catch (e) { /* empty */ }


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

    static getTokenData = async (): Promise<BaseServiceResult<CrepenToken | undefined>> => {
        return await this.baseGetTokenData(await cookies())

    }

    static getTokenDataInEdge = async (req: NextRequest): Promise<BaseServiceResult<CrepenToken | undefined>> => {
        return await this.baseGetTokenData(req.cookies);
    }

    //#endregion






    private static readonly LOCALE_COOKIE_KEY = 'LCAL'

    static getLocaleData = async (): Promise<BaseServiceResult<string | undefined>> => {
        try {
            const cookie = cookies();
            const locale = (await cookie).get(this.LOCALE_COOKIE_KEY)?.value;

            return {
                success: true,
                message: 'Success',
                data: locale
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

    static insertLocaleData = async (locale : string) : Promise<BaseServiceResult> => {
        try {
            const cookie = cookies();
            (await cookie).set(this.LOCALE_COOKIE_KEY , locale);

            return {
                success: true,
                message: 'Success',
                data: locale
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




}