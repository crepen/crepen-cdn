import { NextRequest, NextResponse, URLPattern } from "next/server"
import { BaseMiddleware, BaseMiddlewareResponse } from "./base.middleware";
import { CrepenSessionEdgeService } from "../../services/edge-runtime/edge.session.service";

export class AuthMiddleware implements BaseMiddleware {


    public init = async (req: NextRequest, res: NextResponse): Promise<BaseMiddlewareResponse> => {


        if (req.method !== 'GET') {
            return {
                response: res,
                type: 'next'
            };
        }


        if (!(this.isMatchUrl('/cloud', req.url) || this.isMatchUrl('/cloud/*', req.url))) {
            return {
                response: res,
                type: 'next'
            };
        }

        const token = CrepenSessionEdgeService.getTokenData(req);

        if (this.isMatchUrl('/cloud/login', req.url)) {

            const checkAccTk = await CrepenSessionEdgeService.isTokenExpired('ACCESS', token?.accessToken)
            if (checkAccTk === false) {

                return {
                    type: 'end',
                    response: NextResponse.redirect(new URL('/cloud', req.url))
                }
            }
            else {

                const checkRefTk = await CrepenSessionEdgeService.isTokenExpired('REFRESH', token?.refreshToken)
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
            const isRenew = await CrepenSessionEdgeService.renewalToken(req, res, true);

            if (isRenew === false) {
                return {
                    type: 'end',
                    response: NextResponse.redirect(new URL('/cloud/login', req.url))
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