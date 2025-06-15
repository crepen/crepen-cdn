import { NextRequest, NextResponse } from "next/server";
import { BaseMiddleware, BaseMiddlewareResponse } from "./base.middleware";

export class CommonMiddleware implements BaseMiddleware {



    public init = async (req: NextRequest, res: NextResponse): Promise<BaseMiddlewareResponse> => {
        const url = req.nextUrl.clone()

        //#region Append pathname in header

        if (url.pathname) {
            res.headers.append('x-crepen-pathname', url.pathname);
        }

        //#endregion Append pathname in header

        //#region Append url in header
        if (url.pathname) {
            res.headers.append('x-crepen-url', new URL(url.pathname, url.origin).toString());
        }

        //#endregion Append url in header

        
        res.headers.append('x-crepen-basepath', req.nextUrl.basePath)


        return {
            response: res,
            type: 'next'
        }
    }

}