import {  CookieService } from '@crepen-cdn/core/service';
import { NextResponse, URLPattern, type NextRequest } from 'next/server';
 
export const middleware = async (request: NextRequest) => {

    const cookieData = request.cookies.get('crepen-uif')?.value;
    const response = NextResponse.next();

    if(!isMatchUrl('/login',request.url)){
        // Check Login
        if(CookieService.isExpireUserSession(cookieData)){
            
            return NextResponse.redirect(new URL(`/login?callback=${encodeURIComponent(request.url)}` , request.url));
        }
    }
    else{
        if(!CookieService.isExpireUserSession(cookieData)){

            

            const callbackUrl = request.nextUrl.searchParams.get('callback') ?? undefined;
            if(callbackUrl){
                return NextResponse.redirect(new URL(callbackUrl));    
            }
            else{
                return NextResponse.redirect(new URL('/' , request.url));
            }
            
        }
    }


    return response;

}


const isMatchUrl = (pathPattern : string , url : string) => {
    const urlPattern : URLPattern = new URLPattern({pathname : pathPattern});
    const splitUrl = url.split('?')[0];

    const isMatch : boolean = urlPattern.exec(splitUrl) !== null;

    return isMatch;

}
 
export const config = {
    matcher: ['/', '/((?!api|_next/static|_next/image|images|favicon.ico).*)', { source: '/' }]
}