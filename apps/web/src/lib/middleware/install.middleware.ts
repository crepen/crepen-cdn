import { NextRequest, NextResponse, URLPattern } from "next/server";
import { BaseMiddleware, BaseMiddlewareResponse } from "./base.middleware";
import { CrepenSystemInstallOperationService } from "@web/modules/crepen/system/install/CrepenSystemInstallOperationService";
import urlJoin from "url-join";
import { StringUtil } from "../util/string.util";

export class InstallMiddleware implements BaseMiddleware {
    public init = async (req: NextRequest, res: NextResponse): Promise<BaseMiddlewareResponse> => {

        const basePath = StringUtil.isEmpty(req.nextUrl.basePath) ? '/' : req.nextUrl.basePath;

        if (req.method !== 'GET') {
            return {
                response: res,
                type: 'next'
            };
        }

        const installStateReq = await CrepenSystemInstallOperationService.getInstallState();

        console.log(installStateReq);

        if (installStateReq.data?.installState !== true) {
            //SYSTEM INSTALL NOT YET



            const accessPort = req.headers.get('x-forwarded-port');
            const accessHost = req.headers.get('x-forwarded-host')?.replace(accessPort ?? '', '').replace(":", "");

            console.log(accessHost);
            if (accessHost === 'localhost') {
                if (!this.urlMatch(req, '/install') && !this.urlMatch(req, '/install/*')) {
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

            if (this.urlMatch(req, '/install') || this.urlMatch(req, '/install/*')) {
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


