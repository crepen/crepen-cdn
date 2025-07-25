import { NextRequest, NextResponse, URLPattern } from "next/server";
import { BaseMiddleware, BaseMiddlewareResponse } from "./BaseMiddleware";
import urlJoin from "url-join";
import { SystemDataService } from "@web/modules/api/service/SystemDataService";
import { StringUtil } from "@web/lib/util/string.util";

export class InstallMiddleware implements BaseMiddleware {
    public init = async (req: NextRequest, res: NextResponse): Promise<BaseMiddlewareResponse> => {

        const basePath = StringUtil.isEmpty(req.nextUrl.basePath) ? '/' : req.nextUrl.basePath;

        if (req.method !== 'GET') {
            return {
                response: res,
                type: 'next'
            };
        }

        const serverHealthState = await SystemDataService.getServerHealth();


        const accessPort = req.headers.get('x-forwarded-port');
        const accessHost = req.headers.get('x-forwarded-host')?.replace(accessPort ?? '', '').replace(":", "");


        if (serverHealthState.install !== true) {
            //SYSTEM INSTALL NOT YET

            if (accessHost === 'localhost') {
                if (
                    (!this.urlMatch(req, '/install') && !this.urlMatch(req, '/install/*'))
                    || this.urlMatch(req, '/install/success')
                ) {
                    return {
                        type: 'end',
                        response: NextResponse.redirect(new URL(urlJoin(basePath, '/install'), req.url))
                    }
                }
            }
            else {
                if (!this.urlMatch(req, '/install/block')) {
                    return {
                        type: 'end',
                        response: NextResponse.redirect(new URL(urlJoin(basePath, '/install/block'), req.url))
                    }
                }
            }


        }
        else {
            // SYSTEIM INSTALL COMPLETE

            if (accessHost === 'localhost' && this.urlMatch(req, '/install/success')) {
                /** empty */
            }
            else if (this.urlMatch(req, '/install') || this.urlMatch(req, '/install/*')) {
                return {
                    type: 'end',
                    response: NextResponse.redirect(new URL(urlJoin(basePath), req.url))
                }
            }
        }



        return {
            response: res,
            type: 'next'
        }
    }



    private urlMatch = (req: NextRequest, pattern: string) => {

        let fullPattern = `${req.nextUrl.basePath}${pattern}`

        if (fullPattern.endsWith('/')) {
            fullPattern = fullPattern.slice(0, fullPattern.length - 1);
        }

        const urlPattern: URLPattern = new URLPattern({ pathname: fullPattern });
        const isMatch = urlPattern.exec(req.url) !== null;


        return isMatch;
    }
}


