import { BasePathProvider } from "../../modules/basepath/BasePathProvider";
import { StringUtil } from "../util/StringUtil";
import { BaseMiddleware, BaseMiddlewareResponse } from "./BaseMiddleware";
import { NextRequest, NextResponse } from 'next/server'

export class ConfigMiddleware implements BaseMiddleware {


    public init = async (req: NextRequest, res: NextResponse): Promise<BaseMiddlewareResponse> => {

        const basePath = StringUtil.isEmpty(req.nextUrl.basePath) ? '/' : req.nextUrl.basePath;
        BasePathProvider.instance(req.headers, res.headers)
            .setBasePath(basePath)




        return {
            response: res,
            type: 'next'
        }
    }
}