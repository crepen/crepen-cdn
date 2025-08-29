import { NextRequest, NextResponse } from "next/server";
import { BaseMiddleware, BaseMiddlewareResponse } from "./BaseMiddleware";
import { RestSystemDataService } from "../api-module/RestSystemDataService";
import { ServerLocaleInitializer } from "../locale/ServerLocaleInitializer";
import { LocaleConfig } from "@web/lib/config/LocaleConfig";
import urlJoin from "url-join";
import { UrlUtil } from "@web/lib/util/UrlUtil";
import { StringUtil } from "@web/lib/util/StringUtil";

export class ApiStateMiddleware implements BaseMiddleware {
    public init = async (req: NextRequest, res: NextResponse): Promise<BaseMiddlewareResponse> => {
        const initializer = ServerLocaleInitializer.current(LocaleConfig);


        const basePath = StringUtil.isEmpty(req.nextUrl.basePath) ? '/' : req.nextUrl.basePath;


        try {
            const apiService = await RestSystemDataService.current(undefined, await initializer.get({readCookie : req.cookies}) ?? LocaleConfig.defaultLocale);
            void await apiService.getServerHealth();

            if (UrlUtil.isMatchPattern(req.url, '/error/api', { basePath: basePath })) {
                return {
                    type: 'end',
                    response: NextResponse.redirect(new URL(urlJoin(basePath, '/'), req.url))
                }
            }

        }
        catch (e) {

            if (!UrlUtil.isMatchPattern(req.url, '/error/api', { basePath: basePath })) {
                return {
                    type: 'end',
                    response: NextResponse.redirect(new URL(urlJoin(basePath, '/error/api'), req.url))
                }
            }


        }



        return {
            response: res,
            type: 'next'
        }
    }
}