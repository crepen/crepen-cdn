import { NextRequest, NextResponse } from "next/server";

export interface BaseMiddlewareResponse {
    type : 'next' | 'end',
    response : NextResponse
}

export class BaseMiddleware {
    public init = async (req : NextRequest , res : NextResponse) : Promise<BaseMiddlewareResponse> => {
        

        return {
            response : res,
            type : 'next'
        }
    }
}