import { NextRequest, NextResponse, URLPattern } from "next/server"
import { BaseMiddleware, BaseMiddlewareResponse } from "./base.middleware";
import { CrepenSessionEdgeService } from "../../services/edge-runtime/edge.session.service";
import { CrepenCookieOperationService } from "@web/services/operation/cookie.operation.service";
import { CrepenAuthOpereationService } from "@web/services/operation/auth.operation.service";

export class AuthMiddleware implements BaseMiddleware {


    public init = async (req: NextRequest, res: NextResponse): Promise<BaseMiddlewareResponse> => {
        if (req.method !== 'GET') {
            return {
                response: res,
                type: 'next'
            };
        }


        // if (!(this.isMatchUrl('/cloud', req.url) || this.isMatchUrl('/cloud/*', req.url)) || this.isMatchUrl('/cloud/logout', req.url)) {
        //     return {
        //         response: res,
        //         type: 'next'
        //     };
        // }

        if (this.isMatchUrl('/logout', req.url)) {
            return {
                response: res,
                type: 'next'
            };
        }

        const token = await CrepenCookieOperationService.getTokenDataInEdge(req);


        if (this.isMatchUrl('/login', req.url)) {

            const checkAccTk = await CrepenAuthOpereationService.isTokenExpired('access_token', token?.data?.accessToken)

            if (checkAccTk.data?.expired === false) {
                return {
                    type: 'end',
                    response: NextResponse.redirect(new URL('/', req.url))
                }
            }
            else {

                const checkRefTk = await CrepenAuthOpereationService.isTokenExpired('refresh_token', token?.data?.refreshToken)
                if (checkRefTk.data?.expired === false) {

                    return {
                        type: 'end',
                        response: NextResponse.redirect(new URL('/', req.url))
                    }
                }
            }

        }
        else {
            const renewToken = await CrepenAuthOpereationService.renewTokenInEdge(req, true);
            if (renewToken.success !== true) {
                return {
                    type: 'end',
                    response: NextResponse.redirect(new URL('/login', req.url))
                }
            }

            const insertCookie = await CrepenCookieOperationService.insertTokenDataInEdge(res, renewToken.data);
            if (insertCookie.success !== true) {
                return {
                    type: 'end',
                    response: NextResponse.redirect(new URL('/login', req.url))
                }
            }


        }


        return {
            response: res,
            type: 'next'
        }
    }










    isMatchUrl = (pathPattern: string, url: string) => {
        const urlPattern: URLPattern = new URLPattern({ pathname: `${pathPattern}` });
        const splitUrl = url.split('?')[0];

        const isMatch: boolean = urlPattern.exec(splitUrl) !== null;

        return isMatch;

    }
}