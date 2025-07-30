import { NextRequest, NextResponse } from "next/server";
import { BaseMiddleware, BaseMiddlewareResponse } from "./BaseMiddleware";
import { RestSystemDataService } from "../api-module/RestSystemDataService";
import { ServerLocaleInitializer } from "../locale/ServerLocaleInitializer";
import { LocaleConfig } from "@web/lib/config/LocaleConfig";
import urlJoin from "url-join";
import { UrlUtil } from "@web/lib/util/UrlUtil";

export class ApiStateMiddleware implements BaseMiddleware {
    public init = async (req: NextRequest, res: NextResponse): Promise<BaseMiddlewareResponse> => {
        const initializer = ServerLocaleInitializer.current(LocaleConfig);



        try {
            const apiService = await RestSystemDataService.current(undefined, await initializer.get({readCookie : req.cookies}));
            const res = await apiService.getServerHealth();

            if (UrlUtil.isMatchPattern(req.url, '/error/api', { basePath: req.nextUrl.basePath })) {
                return {
                    type: 'end',
                    response: NextResponse.redirect(new URL(urlJoin(req.nextUrl.basePath, '/'), req.url))
                }
            }

        }
        catch (e) {

            if (!UrlUtil.isMatchPattern(req.url, '/error/api', { basePath: req.nextUrl.basePath })) {
                return {
                    type: 'end',
                    response: NextResponse.redirect(new URL(urlJoin(req.nextUrl.basePath, '/error/api'), req.url))
                }
            }


        }



        return {
            response: res,
            type: 'next'
        }
    }
}