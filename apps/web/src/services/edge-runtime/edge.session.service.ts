import { CrepenAuthService } from "@web/lib/service/auth-service";
import { CrepenToken, CrepenTokenType } from "@web/services/types/auth.object";
import { StringUtil } from "@web/lib/util/string.util";
import { NextRequest, NextResponse } from "next/server";
import { CookieService } from "@crepen-cdn/core/service";

export class CrepenSessionEdgeService {


    private static CREPEN_TOKEN_KEY = 'crepen-tk';
    private static CREPEN_TOKEN_EXPIRE_KEY = 'crepen-tk-ex';
    private static CREPEN_USER_KEY = 'crepen-usr';




    /**
     * 토큰 갱신
     * @description 토큰이 만료되었을 경우 토큰 갱신
     * 
     * @param req NextRequest
     * @param res NextResponse
     * @param force `true`일 경우, 토큰이 만료되지 않았을 경우에도 갱신
     * 
     * @returns 갱신 성공 여부 (만료되지 않았을 경우 `true`)
     */
    static renewalToken = async (req: NextRequest, res: NextResponse, force?: boolean): Promise<boolean> => {
        const tokenData = this.getTokenData(req)

        if (force === true) {
            // 강제 토큰 갱신

            const refData = await this.refreshToken(tokenData?.refreshToken);

            if (refData !== undefined) {
                this.saveTokenInCookie(res, refData);
                return true;
            }
            else {
                return false;
            }
        }
        else {
            // 토큰 만료 체크
            const isACTExpired = await this.isTokenExpired('ACCESS', tokenData?.accessToken);

            if (isACTExpired === true) {

                const refData = await this.refreshToken(tokenData?.refreshToken);
                if (refData !== undefined) {
                    this.saveTokenInCookie(res, refData);
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return true;
            }
        }
    }





    static isTokenExpired = async (type: CrepenTokenType, token?: string) => {
        if (StringUtil.isEmpty(token)) {
            return true;
        }

        const expireData = await CrepenAuthService.isTokenExpired(type, token);

        return expireData.data?.expired ?? true;
    }

    static refreshToken = async (refToken?: string): Promise<CrepenToken | undefined> => {
        if (StringUtil.isEmpty(refToken)) {
            return undefined;
        }

        const refData = await CrepenAuthService.refreshUserToken(refToken);



        if (refData.success === true) {
            return refData.data;
        }
        else {
            return undefined;
        }
    }

    static getTokenData = (req: NextRequest): CrepenToken | undefined => {
        const cookieToken = req.cookies.has(this.CREPEN_TOKEN_KEY) ? req.cookies.get(this.CREPEN_TOKEN_KEY) : undefined;

        return CookieService.decryptData<CrepenToken>(cookieToken?.value);
    }


    private static saveTokenInCookie = async (res: NextResponse, tokenData?: CrepenToken) => {
        if (tokenData) {
            const tokenEncryptStr = CookieService.encrtypeData(tokenData);
            res.cookies.set(this.CREPEN_TOKEN_KEY, tokenEncryptStr, {
                expires: (tokenData?.expireTime ?? 1) * 1000,
                secure: process.env.NODE_ENV === 'development' ? false : true,
                httpOnly: process.env.NODE_ENV === 'development' ? false : true
            })
            res.cookies.set(this.CREPEN_TOKEN_EXPIRE_KEY, ((tokenData?.expireTime ?? 0) * 1000).toString(), {
                expires: (tokenData?.expireTime ?? 1) * 1000,
                secure: process.env.NODE_ENV === 'development' ? false : true,
                httpOnly: process.env.NODE_ENV === 'development' ? false : true
            })
            const loginUserData = await CrepenAuthService.getLoginUserData(tokenData?.accessToken);

            const userEncryptStr = CookieService.encrtypeData(loginUserData.data);
            res.cookies.set(this.CREPEN_USER_KEY, userEncryptStr, {
                secure: process.env.NODE_ENV === 'development' ? false : true,
                httpOnly: process.env.NODE_ENV === 'development' ? false : true
            })
        }
        else {
            res.cookies.delete(this.CREPEN_TOKEN_KEY);
            res.cookies.delete(this.CREPEN_TOKEN_EXPIRE_KEY);
            res.cookies.delete(this.CREPEN_USER_KEY);
        }
    }
}