import { NextResponse, type NextRequest } from 'next/server';
import { AuthMiddleware } from './modules/server/middleware/AuthMiddleware';
import { BaseMiddleware } from './modules/server/middleware/BaseMiddleware';
import { CommonMiddleware } from './modules/server/middleware/CommonMiddleware';
import { InstallMiddleware } from './modules/server/middleware/InstallMiddleware';
import { LocaleMiddleware } from './modules/server/middleware/LocaleMiddleware';
export const middleware = async (request: NextRequest) => {


    const middlewareModules: BaseMiddleware[] = [
        new InstallMiddleware(),
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