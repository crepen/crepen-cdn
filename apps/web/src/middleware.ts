import { CookieService } from '@crepen-cdn/core/service';
import { NextResponse, URLPattern, type NextRequest } from 'next/server';
import { CrepenAuthService } from './lib/service/auth-service';
import { CrepenToken } from './lib/service/types/auth';

export const middleware = async (request: NextRequest) => {

    const cookieData = request.cookies.get('crepen-uif')?.value;

    const response = NextResponse.next();

    if (request.cookies.has('crepen-tk')) {
        const tokenData = CookieService.decryptData<CrepenToken>(request.cookies.get('crepen-tk')?.value);
        const loginToken = await CrepenAuthService.refreshUserToken(tokenData?.refreshToken);
        const loginUserData = await CrepenAuthService.getLoginUserData(loginToken.data?.accessToken);

        if (loginToken.success === true && loginUserData.success === true) {
            const tokenEncryptStr = CookieService.encrtypeData(loginToken.data);

            response.cookies.set('crepen-tk', tokenEncryptStr, {
                expires: (loginToken.data?.expireTime ?? 1) * 1000,
                secure: process.env.NODE_ENV === 'development' ? false : true,
                httpOnly: process.env.NODE_ENV === 'development' ? false : true
            })

            response.cookies.set('crepen-tk-ex', ((loginToken.data?.expireTime ?? 0) * 1000).toString(), {
                expires: (loginToken.data?.expireTime ?? 1) * 1000,
                secure: process.env.NODE_ENV === 'development' ? false : true,
                httpOnly: process.env.NODE_ENV === 'development' ? false : true
            })

            const userEncryptStr = CookieService.encrtypeData(loginUserData.data);

            response.cookies.set('crepen-usr', userEncryptStr, {
                secure: process.env.NODE_ENV === 'development' ? false : true,
                httpOnly: process.env.NODE_ENV === 'development' ? false : true
            })
        }
        else {
            if (response.cookies.has('crepen-tk')) {
                response.cookies.delete('crepen-tk');
            }

            if (response.cookies.has('crepen-tk-ex')) {
                response.cookies.delete('crepen-tk-ex');
            }

            if (response.cookies.has('crepen-usr')) {
                response.cookies.delete('crepen-usr');
            }
        }
    }
    else {
        if (response.cookies.has('crepen-tk')) {
            response.cookies.delete('crepen-tk');
        }

        if (response.cookies.has('crepen-tk-ex')) {
            response.cookies.delete('crepen-tk-ex');
        }

        if (response.cookies.has('crepen-usr')) {
            response.cookies.delete('crepen-usr');
        }
    }







    if (!isMatchUrl('/login', request.url)) {

        console.log('1', !response.cookies.has('crepen-tk'));

        if (!response.cookies.has('crepen-tk')) {
            console.log('4')
            return NextResponse.redirect(new URL(`/login?callback=${encodeURIComponent(request.url)}`, request.url));
        }

        // Check Login
        // if (CookieService.isExpireUserSession(request.cookies.get('crepen-tk-ex')?.value)) {

        //     return NextResponse.redirect(new URL(`/login?callback=${encodeURIComponent(request.url)}`, request.url));
        // }
    }
    else {
        console.log('2');

        if (response.cookies.has('crepen-tk')) {
            console.log('3');
            const callbackUrl = request.nextUrl.searchParams.get('callback') ?? undefined;
            if (callbackUrl) {
                return NextResponse.redirect(new URL(callbackUrl));
            }
            else {
                return NextResponse.redirect(new URL('/', request.url));
            }
        }

        // if (!CookieService.isExpireUserSession(request.cookies.get('crepen-tk-ex')?.value)) {





        // }
    }


    return response;

}


const isMatchUrl = (pathPattern: string, url: string) => {
    const urlPattern: URLPattern = new URLPattern({ pathname: pathPattern });
    const splitUrl = url.split('?')[0];

    const isMatch: boolean = urlPattern.exec(splitUrl) !== null;

    return isMatch;

}

export const config = {
    matcher: ['/', '/((?!api|_next/static|_next/image|images|favicon.ico).*)', { source: '/' }]
}