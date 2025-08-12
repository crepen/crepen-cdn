import { NextRequest, NextResponse } from "next/server";
import { BaseMiddleware, BaseMiddlewareResponse } from "./BaseMiddleware";
import { ServerLocaleInitializer } from "../locale/ServerLocaleInitializer";
import { LocaleConfig } from "@web/lib/config/LocaleConfig";
import { StringUtil } from "@web/lib/util/StringUtil";

export class LocaleMiddleware implements BaseMiddleware {



    public init = async (req: NextRequest, res: NextResponse): Promise<BaseMiddlewareResponse> => {
        const initializer = ServerLocaleInitializer.current(LocaleConfig);

        try {
            const systemLocale = await initializer.get({ readCookie: req.cookies });

            if (!StringUtil.isEmpty(systemLocale)) {
                initializer.set(systemLocale, { writeCookie: res.cookies });
            }
            else {
                const acceptLanguage = req.headers.get('accept-language')?.split(';')[0];
                const languageList = acceptLanguage?.split(',') ?? [];

                let applyLocale: string | undefined = undefined;

                for (const item of languageList) {
                    if (LocaleConfig.supportLocales.find(x => x.trim().toLowerCase() === item.trim().toLowerCase())) {
                        applyLocale = item.trim().toLowerCase();
                        break;
                    }
                }

                initializer.set(applyLocale ?? LocaleConfig.defaultLocale.trim().toLowerCase(), { writeCookie: res.cookies });
            }

        }
        catch (e) {
            // initializer.set(LocaleConfig.defaultLocale, {writeCookie : res.cookies});
        }


        return {
            response: res,
            type: 'next'
        }
    }

}