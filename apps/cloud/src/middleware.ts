import { NextRequest, NextResponse } from "next/server";
import { LocaleMiddleware } from "./lib/module/middleware/LocaleMiddleware";
import { BaseMiddleware } from "./lib/module/middleware/BaseMiddleware";
import { ApiStateMiddleware } from "./lib/module/middleware/ApiStateMiddleware";
import { CommonMiddleware } from "./lib/module/middleware/CommonMiddleware";
import { AuthMiddleware } from "./lib/module/middleware/AuthMiddleware";

export const middleware = async (request: NextRequest) => {
    const middlewareModules: BaseMiddleware[] = [
        // new ServerConnectMiddleware(),
        // new InstallMiddleware(),
        new ApiStateMiddleware(),
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