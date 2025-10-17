import { LocaleConfig } from "../../modules/locale-module/LocaleConfig";
import { StringUtil } from "../util/StringUtil";
import { BaseMiddleware, BaseMiddlewareResponse } from "./BaseMiddleware";
import { NextRequest, NextResponse } from 'next/server'

export class LocaleMiddleware implements BaseMiddleware {


    public init = async (req: NextRequest, res: NextResponse) : Promise<BaseMiddlewareResponse> => {


        const localeHeaderValue = req.headers.get('X-CP-LOCALE');


        if(StringUtil.isEmpty(localeHeaderValue) || LocaleConfig.supportLocales.indexOf(localeHeaderValue ?? '') === -1){
            req.headers.set('X-CP-LOCALE' , LocaleConfig.defaultLocale);
        }

        




        return {
            response : res,
            type : 'next'
        }
    }
}