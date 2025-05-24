import { NextResponse, type NextRequest } from 'next/server';
import { AuthMiddleware } from './lib/middleware/auth.middleware';
import { BaseMiddleware } from './lib/middleware/base.middleware';
import { LocaleMiddleware } from './lib/middleware/locale.middleware';
import { CommonMiddleware } from './lib/middleware/common.middleware';

export const middleware = async (request: NextRequest) => {


    const middlewareModules: BaseMiddleware[] = [
        new AuthMiddleware(),
        new LocaleMiddleware(),
        new CommonMiddleware()
    ]

    let lastResponse: NextResponse = NextResponse.next();
    let middlewareState: 'next' | 'end' = 'next';


    for (let i = 0; i < middlewareModules.length; i++) {
        if (middlewareState === 'next') {
            const result = await middlewareModules[i]?.init(request, lastResponse);

            if (result !== undefined) {
                lastResponse = result.response;
                middlewareState = result.type;
            }
        }
    }


    return lastResponse;


}


export const config = {
    matcher: ['/', '/((?!api|_next/static|_next/image|images|favicon.ico).*)', { source: '/' }]
}