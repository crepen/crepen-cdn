import { NextRequest, NextResponse } from "next/server";
import { BaseMiddleware, BaseMiddlewareResponse } from "./BaseMiddleware";
import { ServerLocaleInitializer } from "../locale/ServerLocaleInitializer";
import { LocaleConfig } from "@web/lib/config/LocaleConfig";

export class LocaleMiddleware implements BaseMiddleware {



    public init = async (req: NextRequest, res: NextResponse): Promise<BaseMiddlewareResponse> => {
        const initializer = ServerLocaleInitializer.current(LocaleConfig);

        try {
            const systemLocale = await initializer.get({readCookie : req.cookies});
            initializer.set(systemLocale, {writeCookie : res.cookies});
        }
        catch (e) {
            initializer.set(LocaleConfig.defaultLocale, {writeCookie : res.cookies});
        }


        return {
            response: res,
            type: 'next'
        }
    }

}