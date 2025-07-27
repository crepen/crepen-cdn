import { NextRequest, NextResponse } from "next/server"
import { BaseMiddleware, BaseMiddlewareResponse } from "./BaseMiddleware";
import urlJoin from "url-join";
import { StringUtil } from "@web/lib/util/string.util";
import { UrlUtil } from "@web/modules/util/UrlUtil";
import { AuthSessionProvider } from "../service/AuthSessionProvider";

export class AuthMiddleware implements BaseMiddleware {

    ignoreUrlPatterns: string[] = [
        '/install/*',
        '/error/*',
        '/logout/*'
    ]

    public init = async (req: NextRequest, res: NextResponse): Promise<BaseMiddlewareResponse> => {
        const basePath = StringUtil.isEmpty(req.nextUrl.basePath) ? '/' : req.nextUrl.basePath;


        const ignoreListResult = UrlUtil.isMatchPatterns(req.url, this.ignoreUrlPatterns, { basePath: basePath });

        if (req.method !== 'GET' || ignoreListResult) {
            return {
                response: res,
                type: 'next'
            };
        }

        const callbackUrl = req.nextUrl.searchParams.get('callback');




        const requestSessionData = req.cookies.get('CP_SESSION')?.value;

        if (requestSessionData) {
            res.cookies.set('CP_SESSION', requestSessionData);
        }






        const prov = await AuthSessionProvider.instance({ cookie: res.cookies })

        if (UrlUtil.isMatchPattern(req.url, '/login/*', { basePath: basePath })) {


            try {
                const sessionData = await prov.getUserSession();
                await sessionData.token?.refreshUserToken({ cookie: res.cookies });

                return {
                    type: 'end',
                    response: NextResponse.redirect(new URL(urlJoin(basePath, callbackUrl ?? '/'), req.url))
                }
            }
            catch (e) {
                await prov.reset()
            }
        }
      
        else {


            try {
                const sessionData = await prov.getUserSession();
                await sessionData.token?.refreshUserToken({ cookie: res.cookies });
            }
            catch (e) {
                await prov.reset();

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