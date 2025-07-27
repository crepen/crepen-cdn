import { cookies } from "next/headers";
import { CrepenToken } from "../types/object/auth.object"
import { CrepenCryptoUtil } from "@web/lib/util/crypto.util";
import { StringUtil } from "@web/lib/util/string.util";
import { NextRequest, NextResponse } from "next/server";
import { ReadonlyRequestCookies, ResponseCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { CrepenServiceResult } from "@web/modules/common-1/result/CrepenServiceResult";
import { CrepenServiceError } from "@web/modules/common-1/error/CrepenServiceError";
import { CrepenBaseError } from "@web/modules/common-1/error/CrepenBaseError";

/** @deprecated */
export class CrepenCookieOperationService {

    private static readonly TOKEN_COOKIE_KEY = 'CPTN'
    private static getTokenSecretKey = (): string | undefined => {
        return process.env.AUTH_SECRET;
    };

    //#region INSERT_TOKEN

    private static baseInsertTokenData = async (tokenGroup: CrepenToken | undefined, cookieFunc: ReadonlyRequestCookies | ResponseCookies): Promise<CrepenServiceResult<{key : string , value? : string} | undefined>> => {
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
                throw new CrepenServiceError('Encrypt Error', 500);
            }

            cookie.delete(this.TOKEN_COOKIE_KEY);
            cookie.set(this.TOKEN_COOKIE_KEY, encryptStr!, {
                secure: process.env.NODE_ENV === 'development' ? false : true,
                httpOnly: process.env.NODE_ENV === 'development' ? false : true,
            });

            cookie.delete('CPTKRFDT');
            cookie.set('CPTKRFDT' , new Date().toUTCString())

            return {
                success: true,
                message: 'Success',
                data : {
                    key : this.TOKEN_COOKIE_KEY,
                    value : encryptStr
                }
            }
        }
        catch (e) {
            let err = new CrepenServiceResult<{ key: string; value?: string | undefined; } | undefined>({
                success: false,
                message: '알 수 없는 오류입니다.',
                innerError: e as Error
            })

            if (e instanceof CrepenBaseError) {
                err = new CrepenServiceResult<{ key: string; value?: string | undefined; } | undefined>({
                    ...e.toResult()
                })
            }

            return err;
        }
    }

    static insertTokenData = async (tokenGroup?: CrepenToken): Promise<CrepenServiceResult> => {
        return await this.baseInsertTokenData(tokenGroup, await cookies())
    }

    static insertTokenDataInEdge = async (res: NextResponse, tokenGroup?: CrepenToken): Promise<CrepenServiceResult> => {
        return await this.baseInsertTokenData(tokenGroup, res.cookies);
    }

    //#endregion

    //#region GET_TOKEN

    private static baseGetTokenData = async (cookieFunc: ReadonlyRequestCookies | RequestCookies): Promise<CrepenServiceResult<CrepenToken | undefined>> => {
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
             let err = new CrepenServiceResult<CrepenToken | undefined>({
                success: false,
                message: '알 수 없는 오류입니다.',
                innerError: e as Error
            })

            if (e instanceof CrepenBaseError) {
                err = new CrepenServiceResult<CrepenToken | undefined>({
                    ...e.toResult()
                })
            }

            return err;
        }

    }

    static getTokenData = async (): Promise<CrepenServiceResult<CrepenToken | undefined>> => {
        return await this.baseGetTokenData(await cookies())

    }

    static getTokenDataInEdge = async (req: NextRequest): Promise<CrepenServiceResult<CrepenToken | undefined>> => {
        return await this.baseGetTokenData(req.cookies);
    }

    //#endregion

    //#region DELETE_TOKEN

    private static baseLogoutUser = async (cookieFunc: ReadonlyRequestCookies | ResponseCookies): Promise<CrepenServiceResult> => {
        try {
            const cookie = cookieFunc;
            cookie.delete(this.TOKEN_COOKIE_KEY);

            return {
                success: true
            }
        }
        catch (e) {
            let err = new CrepenServiceResult<CrepenToken | undefined>({
                success: false,
                message: '알 수 없는 오류입니다.',
                innerError: e as Error
            })

            if (e instanceof CrepenBaseError) {
                err = new CrepenServiceResult<CrepenToken | undefined>({
                    ...e.toResult()
                })
            }

            return err;
        }
    }

    static logoutUser = async (): Promise<CrepenServiceResult> => {
        return await this.baseLogoutUser(await cookies())
    }

    static logoutUserInEdge = async (res: NextResponse): Promise<CrepenServiceResult> => {
        return await this.baseLogoutUser(res.cookies);
    }

    //#endregion DELETE_TOKEN





    //#region USER_ROOT_FOLDER

    private static readonly USER_ROOT_FOLDER_KEY = 'CPUF_ID';

    //#region GET_USER_ROOT_FOLDER
    private static baseGetRootFolderUid = async (cookieFunc: ReadonlyRequestCookies | ResponseCookies): Promise<CrepenServiceResult<string | undefined>> => {
        try {
            const cookie = cookieFunc;
            const uid = cookie.get(this.USER_ROOT_FOLDER_KEY)?.value;

            return {
                success: true,
                data: uid
            }
        }
        catch (e) {
             let err = new CrepenServiceResult<string | undefined>({
                success: false,
                message: '알 수 없는 오류입니다.',
                innerError: e as Error
            })

            if (e instanceof CrepenBaseError) {
                err = new CrepenServiceResult<string | undefined>({
                    ...e.toResult()
                })
            }

            return err;
        }
    }

    static getRootFolderUid = async () => {
        return this.baseGetRootFolderUid(await cookies());
    }

    static getRootFolderUidInEdge = async (res: NextResponse) => {
        return this.baseGetRootFolderUid(res.cookies);
    }
    //#endregion GET_USER_ROOT_FOLDER



    //#region SET_USER_ROOT_FOLDER


    private static baseSetRootFolderUid = async (cookieFunc: ReadonlyRequestCookies | ResponseCookies, rootFolderUid: string): Promise<CrepenServiceResult<string | undefined>> => {
        try {
            const cookie = cookieFunc;
            const uid = cookie.set(this.USER_ROOT_FOLDER_KEY, rootFolderUid);

            return {
                success: true
            }
        }
        catch (e) {
             let err = new CrepenServiceResult<string | undefined>({
                success: false,
                message: '알 수 없는 오류입니다.',
                innerError: e as Error
            })

            if (e instanceof CrepenBaseError) {
                err = new CrepenServiceResult<string | undefined>({
                    ...e.toResult()
                })
            }

            return err;
        }
    }

    static setRootFolderUid = async (uid: string) => {
        return this.baseSetRootFolderUid(await cookies(), uid);
    }

    static setRootFolderUidInEdge = async (res: NextResponse, uid: string) => {
        return this.baseSetRootFolderUid(res.cookies, uid);
    }
    //#endregion SET_USER_ROOT_FOLDER


    //#endregion


    //#region LOGIN_UNIQUE_STRING

    private static readonly LOGIN_UNIQUE_STRING_KEY = 'CPLUK';

    //#region GET_LOGIN_UNIQUE_STRING
    private static baseGetLoginUniqueString = async (cookieFunc: ReadonlyRequestCookies | ResponseCookies): Promise<CrepenServiceResult<string | undefined>> => {
        try {
            const cookie = cookieFunc;
            const uid = cookie.get(this.LOGIN_UNIQUE_STRING_KEY)?.value;

            return {
                success: true,
                data: uid
            }
        }
        catch (e) {
             let err = new CrepenServiceResult<string | undefined>({
                success: false,
                message: '알 수 없는 오류입니다.',
                innerError: e as Error
            })

            if (e instanceof CrepenBaseError) {
                err = new CrepenServiceResult<string | undefined>({
                    ...e.toResult()
                })
            }

            return err;
        }
    }

    static getLoginUniqueString = async () => {
        return this.baseGetLoginUniqueString(await cookies());
    }

    static getLoginUniqueStringInEdge = async (res: NextResponse) => {
        return this.baseGetLoginUniqueString(res.cookies);
    }
    //#endregion GET_LOGIN_UNIQUE_STRING



    //#region SET_LOGIN_UNIQUE_STRING


    private static baseSetLoginUniqueString = async (cookieFunc: ReadonlyRequestCookies | ResponseCookies, str: string): Promise<CrepenServiceResult<string | undefined>> => {
        try {
            const cookie = cookieFunc;
            const strs = cookie.set(this.LOGIN_UNIQUE_STRING_KEY, str);

            return {
                success: true
            }
        }
        catch (e) {
            let err = new CrepenServiceResult<string | undefined>({
                success: false,
                message: '알 수 없는 오류입니다.',
                innerError: e as Error
            })

            if (e instanceof CrepenBaseError) {
                err = new CrepenServiceResult<string | undefined>({
                    ...e.toResult()
                })
            }

            return err;
        }
    }

    static setLoginUniqueString = async (str: string) => {
        return this.baseSetLoginUniqueString(await cookies(), str);
    }

    static setLoginUniqueStringInEdge = async (res: NextResponse, uid: string) => {
        return this.baseSetLoginUniqueString(res.cookies, uid);
    }
    //#endregion SET_LOGIN_UNIQUE_STRING


    //#endregion












    private static readonly LOCALE_COOKIE_KEY = 'LCAL'

    static getLocaleData = async (): Promise<CrepenServiceResult<string | undefined>> => {
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



            let err = new CrepenServiceResult<string | undefined>({
                success: false,
                message: '알 수 없는 오류입니다.',
                innerError: e as Error
            })

            if (e instanceof CrepenBaseError) {
                err = new CrepenServiceResult<string | undefined>({
                    ...e.toResult()
                })
            }

            return err;
        }
    }

    static insertLocaleData = async (locale: string): Promise<CrepenServiceResult> => {
        try {
            const cookie = cookies();
            (await cookie).set(this.LOCALE_COOKIE_KEY, locale);

            return {
                success: true,
                message: 'Success',
                data: locale
            }
        }
        catch (e) {



             let err = new CrepenServiceResult<string | undefined>({
                success: false,
                message: '알 수 없는 오류입니다.',
                innerError: e as Error
            })

            if (e instanceof CrepenBaseError) {
                err = new CrepenServiceResult<string | undefined>({
                    ...e.toResult()
                })
            }

            return err;
        }
    }




}