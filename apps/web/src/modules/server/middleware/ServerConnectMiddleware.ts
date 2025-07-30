import { NextRequest, NextResponse } from "next/server";
import { BaseMiddleware, BaseMiddlewareResponse } from "./BaseMiddleware";
import { UrlUtil } from "@web/lib/util/UrlUtil";
import { StringUtil } from "@web/lib/util/string.util";
import urlJoin from "url-join";
import { SystemDataService } from "@web/lib/modules/api-server/service/SystemDataService";

export class ServerConnectMiddleware implements BaseMiddleware {

    ignoreUrlPatterns: string[] = [
        '/error/*'
    ]

    public init = async (req: NextRequest, res: NextResponse): Promise<BaseMiddlewareResponse> => {
        try {

            const basePath = StringUtil.isEmpty(req.nextUrl.basePath) ? '/' : req.nextUrl.basePath;
            const ignoreListResult = UrlUtil.isMatchPatterns(req.url, this.ignoreUrlPatterns, { basePath: basePath });

            if (req.method !== 'GET' || ignoreListResult) {
                return {
                    response: res,
                    type: 'next'
                };
            }

            const serverHealth = await SystemDataService.getServerHealth();

          

            if (serverHealth.api !== true) {
                return {
                    type: 'end',
                    response: NextResponse.redirect(new URL(urlJoin(basePath, '/error/server'), req.url))
                }
            }
        }
        catch (e) {

        }


        return {
            response: res,
            type: 'next'
        }
    }
}