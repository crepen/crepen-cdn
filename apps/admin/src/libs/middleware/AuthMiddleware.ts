import { cookies } from "next/headers";
import { SessionProvider } from "../../modules/session/SessionProvider";
import { StringUtil } from "../util/StringUtil";
import { BaseMiddleware, BaseMiddlewareResponse } from "./BaseMiddleware";
import { NextRequest, NextResponse } from 'next/server'
import { BasePathProvider } from "../../modules/basepath/BasePathProvider";
import { UrlUtil } from "../util/UrlUtil";
import urlJoin from "url-join";

export class AuthMiddleware implements BaseMiddleware {

    private _ignoreUrlList = [
        '/signin/*',
        '/signout/*'
    ]


    public init = async (req: NextRequest, res: NextResponse): Promise<BaseMiddlewareResponse> => {

        const basePath = await BasePathProvider.instance(res.headers)
            .getBasePath();

        const refreshAuth = await SessionProvider.instance(req.cookies, res.cookies)
            .refreshToken();

        const isAuthCheckUrl = !UrlUtil.isMatchPatterns(req.nextUrl.href, this._ignoreUrlList, {
            basePath: basePath
        });

        console.log('===============================')
        console.log(req.nextUrl);
        console.log(basePath);
        console.log(  urlJoin(
                            req.nextUrl.origin,
                            basePath === '/' ? '' : basePath,
                            '/signin'
                        ));
        console.log('===============================')


        if(isAuthCheckUrl){
            if(!refreshAuth.success) {
                return {
                    response : NextResponse.redirect(
                        urlJoin(
                            req.nextUrl.origin,
                            basePath === '/' ? '' : basePath,
                            'signin'
                        )
                    ),
                    type : 'end'
                }
            }
        }
        else{
            if(refreshAuth.success){
                return {
                      response : NextResponse.redirect(
                        urlJoin(
                            req.nextUrl.origin,
                            basePath === '/' ? '' : basePath,
                            '/'
                        )
                    ),
                    type : 'end'
                }
            }
        }






        return {
            response: res,
            type: 'next'
        }
    }
}