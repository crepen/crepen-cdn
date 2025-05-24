import { NextRequest } from "next/server";
import * as acceptLanguageParser from 'accept-language-parser';
import { StringUtil } from "@web/lib/util/string.util";

export class CrepenHttpEdgeService {

    static getLanguageCode = (req: NextRequest, allowArray?: string[], defaultLanguage?: string): string | undefined => {
        const acceptLanguage = req.headers.get('accept-language') ?? undefined;
        if (StringUtil.isEmpty(acceptLanguage)) {
            return undefined;
        }
        const languageArray = acceptLanguageParser.parse(acceptLanguage).map(x => x.code).filter(x => x !== undefined);


        if (allowArray === undefined) {
            if (languageArray.length === 0) {
                return defaultLanguage;
            }
            else {
                return StringUtil.isEmpty(languageArray[0]) ? languageArray[0] : defaultLanguage;
            }

        }
        else {
            let language = undefined;

            for (let i = 0; i < languageArray.length; i++) {


                if (allowArray.indexOf(languageArray[i] ?? 'NF') > -1) {

                    language = languageArray[i] ?? undefined;
                    break;
                }

            }

            return language ?? defaultLanguage;
        }

    }

    
}