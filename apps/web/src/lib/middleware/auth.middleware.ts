import { CookieService } from "@crepen-cdn/core/service";
import { NextRequest, NextResponse, URLPattern } from "next/server"
import { CrepenToken, CrepenTokenType } from "../service/types/auth";
import { BaseMiddleware, BaseMiddlewareResponse } from "./base.middleware";
import { CrepenAuthService } from "../service/auth-service";
import { StringUtil } from "../util/string.util";

export class AuthMiddleware implements BaseMiddleware {


    public init = async (req: NextRequest, res: NextResponse): Promise<BaseMiddlewareResponse> => {


         if (req.method !== 'GET') {
            return {
                response: res,
                type: 'next'
            };
        }


        if(!(this.isMatchUrl('/cloud' , req.url) || this.isMatchUrl('/cloud/*' , req.url))){
              return {
                response: res,
                type: 'next'
            };
        }


        

        const token = this.getCookieToken(req);



        if (this.isMatchUrl('/cloud/login', req.url)) {
            
            const checkAccTk = await this.isTokenExpire('ACCESS', token?.accessToken)
            if (checkAccTk === false) {

                return {
                    type: 'end',
                    response: NextResponse.redirect(new URL('/cloud', req.url))
                }
            }
            else {

                const checkRefTk = await this.isTokenExpire('REFRESH', token?.refreshToken)
                if (checkRefTk === false) {

                    return {
                        type: 'end',
                        response: NextResponse.redirect(new URL('/cloud', req.url))
                    }
                }
            }

        }
        else if (this.isMatchUrl('/cloud/logout', req.url)) {

            return {
                response: res,
                type: 'next'
            }
        }
        else {
           
            // REF TOKEN
            const refData = await this.refreshToken(token?.refreshToken);

            if (refData === undefined) {

                return {
                    type: 'end',
                    response: NextResponse.redirect(new URL('/cloud/login', req.url))
                }
            }
            else {

                // REWRITE COOKIE
                const tokenEncryptStr = CookieService.encrtypeData(refData);
                res.cookies.set('crepen-tk', tokenEncryptStr, {
                    expires: (refData?.expireTime ?? 1) * 1000,
                    secure: process.env.NODE_ENV === 'development' ? false : true,
                    httpOnly: process.env.NODE_ENV === 'development' ? false : true
                })
                res.cookies.set('crepen-tk-ex', ((refData?.expireTime ?? 0) * 1000).toString(), {
                    expires: (refData?.expireTime ?? 1) * 1000,
                    secure: process.env.NODE_ENV === 'development' ? false : true,
                    httpOnly: process.env.NODE_ENV === 'development' ? false : true
                })
                const loginUserData = await CrepenAuthService.getLoginUserData(refData?.accessToken);

                const userEncryptStr = CookieService.encrtypeData(loginUserData.data);
                res.cookies.set('crepen-usr', userEncryptStr, {
                    secure: process.env.NODE_ENV === 'development' ? false : true,
                    httpOnly: process.env.NODE_ENV === 'development' ? false : true
                })
            }

        }


        return {
            response: res,
            type: 'next'
        }
    }



    refreshToken = async (refToken?: string): Promise<CrepenToken | undefined> => {
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


    isTokenExpire = async (type: CrepenTokenType, token?: string) => {
        if (token === undefined) {
            return true;
        }

        const expireData = await CrepenAuthService.isTokenExpired(type, token);

        return expireData.data?.expired ?? true;
    }



    getCookieToken = (req: NextRequest): CrepenToken | undefined => {
        const cookieToken = req.cookies.has('crepen-tk') ? req.cookies.get('crepen-tk') : undefined;

        return CookieService.decryptData<CrepenToken>(cookieToken?.value);
    }


    isMatchUrl = (pathPattern: string, url: string) => {
        const urlPattern: URLPattern = new URLPattern({ pathname: `${pathPattern}` });
        const splitUrl = url.split('?')[0];

        const isMatch: boolean = urlPattern.exec(splitUrl) !== null;

        return isMatch;

    }
}