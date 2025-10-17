import { NextRequest, NextResponse } from "next/server";
import { BaseMiddleware } from "./libs/middleware/BaseMiddleware";
import { LocaleMiddleware } from "./libs/middleware/LocaleMiddleware";
import { ConfigMiddleware } from "./libs/middleware/ConfigMiddleware";
import { AuthMiddleware } from "./libs/middleware/AuthMiddleware";

export const middleware = async (request: NextRequest) => {
    const middlewareModules: BaseMiddleware[] = [
        new ConfigMiddleware(),
        new AuthMiddleware(),
        new LocaleMiddleware(),
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