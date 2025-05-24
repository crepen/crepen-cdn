import { NextRequest, NextResponse } from "next/server";
import { BaseMiddleware, BaseMiddlewareResponse } from "./base.middleware";
import { CrepenHttpEdgeService } from "../../services/edge-runtime/edge.http.service";
import { CrepenLanguageService } from "../../services/common/language.service";

export class LocaleMiddleware implements BaseMiddleware {



    public init = async (req: NextRequest, res: NextResponse): Promise<BaseMiddlewareResponse> => {

        try {
            const allowLanguages = CrepenLanguageService.getAllowLanguages();
            const defaultLanguage = CrepenLanguageService.getDefaultLanguage();

            const matchLanguage = CrepenHttpEdgeService.getLanguageCode(req, allowLanguages, defaultLanguage);

            await CrepenLanguageService.setSessionLocale(matchLanguage);
        }
        catch (e) {
            await CrepenLanguageService.setSessionLocale();
        }


        return {
            response: res,
            type: 'next'
        }
    }

}