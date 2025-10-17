import { NextRequest, NextResponse } from "next/server";
import { BaseMiddleware, BaseMiddlewareResponse } from "./BaseMiddleware";
import { AuthProvider } from "../auth/AuthProvider";
import { UrlUtil } from "@web/lib/util/UrlUtil";
import { BasePathInitializer } from "../basepath/BasePathInitializer";
import urlJoin from "url-join";
import { StringUtil } from "@web/lib/util/StringUtil";

export class AuthMiddleware implements BaseMiddleware {

    private ignoreAuthUrl = [
        '/error/*',
        '/signout/*',
        '/resource/*'
    ]

    private unAuthPages = [
        '/signin/*',

    ]

    public init = async (req: NextRequest, res: NextResponse): Promise<BaseMiddlewareResponse> => {

        const callbackUrl = req.nextUrl.searchParams.get('callback');

        const basePath = StringUtil.isEmpty(req.nextUrl.basePath) ? '/' : req.nextUrl.basePath;

        if (req.method !== 'GET') {
            return {
                response: res,
                type: 'next'
            }
        }

        try {
            const isRefresh = await AuthProvider.current().refreshSession({ readCookie: req.cookies, writeCookie: res.cookies });

            if (!UrlUtil.isMatchPatterns(req.url, [...this.ignoreAuthUrl, ...this.unAuthPages], { basePath: basePath })) {
                if (!isRefresh.state) {
                    return {
                        type: 'end',
                        response: NextResponse.redirect(new URL(urlJoin(basePath, '/signin', `?callback=${req.nextUrl.pathname}`), req.url))
                    }
                }
            }
            else if (UrlUtil.isMatchPatterns(req.url, this.unAuthPages, { basePath: basePath })) {
                if (isRefresh.state) {
                    return {
                        type: 'end',
                        response: NextResponse.redirect(new URL(urlJoin(basePath, callbackUrl ?? '/'), req.url))
                    }
                }
            }
        }
        catch (e) {
            console.log('AUTH_MIDDLEWARE_ERR', e);
        }





        return {
            response: res,
            type: 'next'
        }
    }
}