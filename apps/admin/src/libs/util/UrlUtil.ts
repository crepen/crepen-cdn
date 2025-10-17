import { URLPattern } from "next/server";
import urlJoin from "url-join";
import { StringUtil } from "./StringUtil";

export class UrlUtil {

    static isMatchPattern = (targetUrl: string, pattern: string, options?: { basePath?: string }) => {

        const fullPattern = urlJoin(StringUtil.isEmpty(options?.basePath) ? '/' : options!.basePath! , pattern);

        const matchUrlPatterns : URLPattern[] = [];


        if (fullPattern.endsWith('/') && fullPattern.trim() !== '/') {
            matchUrlPatterns.push(new URLPattern({ pathname: fullPattern.slice(0, fullPattern.length - 1) }));    
        }
        else {
            matchUrlPatterns.push(new URLPattern({ pathname: fullPattern }));
        }
       


        if(pattern.endsWith('/*') && fullPattern !== '/*'){
            matchUrlPatterns.push(new URLPattern({pathname : fullPattern.slice(0,fullPattern.length - 2)}))
        }

        let isMatch : boolean = false;

        for(const urlPattern of matchUrlPatterns){
            if(isMatch !== true){
                isMatch = urlPattern.exec(targetUrl) !== null;
            }
        }

        return isMatch;

    }

    static isMatchPatterns = (targetUrl : string , patterns : string[] | undefined ,options? : {basePath? : string}) => {
         const patternsResult = (patterns ?? []).reduce(((acc : boolean , value : string) => {
            if(acc !== true){
                return UrlUtil.isMatchPattern(targetUrl , value , {basePath : options?.basePath});
            }

            return acc;
        }) , false)

        return patternsResult;
    }

}