import { NextRequest, NextResponse } from "next/server";
import { BaseMiddleware, BaseMiddlewareResponse } from "./BaseMiddleware";
import { ServerI18nProvider } from "@web/modules/server/i18n/ServerI18nProvider";
import { HttpRequestService } from "@web/modules/server/common/HttpService";

export class LocaleMiddleware implements BaseMiddleware {



    public init = async (req: NextRequest, res: NextResponse): Promise<BaseMiddlewareResponse> => {

        try {
            const acceptLanguage = HttpRequestService.setRequest(req).getLanguage();

            const beforeSetupLocale = await ServerI18nProvider.getSystemLocale();

            if (beforeSetupLocale === undefined) {
                const locale = await ServerI18nProvider.setSystemLocale(acceptLanguage);
            }

        }
        catch (e) {
            await ServerI18nProvider.setSystemLocale('en');
        }


        return {
            response: res,
            type: 'next'
        }
    }

}