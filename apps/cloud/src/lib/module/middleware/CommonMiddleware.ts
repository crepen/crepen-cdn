import { NextRequest, NextResponse } from "next/server";
import { BaseMiddleware, BaseMiddlewareResponse } from "./BaseMiddleware";
import { BasePathInitializer } from "../basepath/BasePathInitializer";

export class CommonMiddleware implements BaseMiddleware {
    public init = async (req: NextRequest, res: NextResponse): Promise<BaseMiddlewareResponse> => {
        

        void await BasePathInitializer.set(req.nextUrl.basePath , {writeHeader : res.headers});

        return {
            response: res,
            type: 'next'
        }
    }
}