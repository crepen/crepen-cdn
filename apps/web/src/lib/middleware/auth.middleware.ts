import { NextRequest, NextResponse, URLPattern } from "next/server"
import { BaseMiddleware, BaseMiddlewareResponse } from "./base.middleware";
import { CrepenCookieOperationService } from "@web/services/operation/cookie.operation.service";
import { CrepenAuthOpereationService } from "@web/modules/crepen/auth/CrepenAuthOpereationService";
import urlJoin from "url-join";
import { StringUtil } from "../util/string.util";

export class AuthMiddleware implements BaseMiddleware {

    private urlMatch = (req: NextRequest, pattern: string) => {

        let fullPattern = `${req.nextUrl.basePath}${pattern}`

        if (fullPattern.endsWith('/')) {
            fullPattern = fullPattern.slice(0, fullPattern.length - 1);
        }

        const urlPattern: URLPattern = new URLPattern({ pathname: fullPattern });
        const isMatch = urlPattern.exec(req.url) !== null;


        return isMatch;
    }

    public init = async (req: NextRequest, res: NextResponse): Promise<BaseMiddlewareResponse> => {


        const basePath = StringUtil.isEmpty(req.nextUrl.basePath) ? '/' : req.nextUrl.basePath;


        console.log(req.url , `${req.nextUrl.basePath}${'/install/*'}` , this.urlMatch(req,'/install/*') , this.urlMatch(req,'/install'))

        // const realUrl = req.nextUrl.origin + process.env.BASE_PATH + req.nextUrl.pathname;

        if (req.method !== 'GET') {
            return {
                response: res,
                type: 'next'
            };
        }


        if (!(this.urlMatch(req, '/') || this.urlMatch(req, '/*')) || this.urlMatch(req, '/logout')) {
            return {
                response: res,
                type: 'next'
            };
        }


        const token = await CrepenCookieOperationService.getTokenDataInEdge(req);

        if (this.urlMatch(req, '/login')) {

            const callbackUrl = req.nextUrl.searchParams.get('callback');

            const checkAccTk = await CrepenAuthOpereationService.isAccessTokenExpired(token?.data?.accessToken)

            if (checkAccTk.data?.expired === false) {
                return {
                    type: 'end',
                    response: NextResponse.redirect(new URL(urlJoin(basePath, callbackUrl ?? '/'), req.url))
                }
            }
            else {

                const checkRefTk = await CrepenAuthOpereationService.isRefreshTokenExpired(token?.data?.refreshToken)
                if (checkRefTk.data?.expired === false) {

                    const renewToken = await CrepenAuthOpereationService.renewTokenInEdge(req, true);
                    if (renewToken.success !== true) {
                        return {
                            type: 'end',
                            response: NextResponse.redirect(new URL(urlJoin(basePath, '/login', StringUtil.isEmpty(callbackUrl) ? '' : `?callback=${callbackUrl}`), req.url))
                        }
                    }

                    const insertCookie = await CrepenCookieOperationService.insertTokenDataInEdge(res, renewToken.data);
                    if (insertCookie.success !== true) {
                        return {
                            type: 'end',
                            response: NextResponse.redirect(new URL(urlJoin(basePath, '/login', StringUtil.isEmpty(callbackUrl) ? '' : `?callback=${callbackUrl}`), req.url))
                        }
                    }



                    return {
                        type: 'end',
                        response: NextResponse.redirect(new URL(urlJoin(basePath, callbackUrl ?? '/'), req.url))
                    }
                }
            }

        }
        else if (this.urlMatch(req, '/logout')) { /* empty */ }
        else if (this.urlMatch(req, '/install/*') || this.urlMatch(req , '/install')) {
            console.log("INSTALL REQUEST")
         }
        else {
            const renewToken = await CrepenAuthOpereationService.renewTokenInEdge(req, true);
            if (renewToken.success !== true) {
                return {
                    type: 'end',
                    response: NextResponse.redirect(new URL(urlJoin(basePath, '/login', `?callback=${req.nextUrl.pathname}`), req.url))
                }
            }

            const insertCookie = await CrepenCookieOperationService.insertTokenDataInEdge(res, renewToken.data);
            if (insertCookie.success !== true) {
                return {
                    type: 'end',
                    response: NextResponse.redirect(new URL(urlJoin(basePath, '/login', `?callback=${req.nextUrl.pathname}`), req.url))
                }
            }
        }


        return {
            response: res,
            type: 'next'
        }
    }









}