import { CrepenBaseError } from "@web/modules/common-1/error/CrepenBaseError";
import { NextRequest, NextResponse } from "next/server";

interface RequestContext {
    params: Promise<
        {
            uid: string;
        }
    >;
}

export const GET = async (req: NextRequest, res: NextResponse & RequestContext) => {
    try {
        const uid = (await res.params).uid;


        let apiUrl = process.env.API_URL ?? '';

        if ((process.env.API_URL ?? '').endsWith('/')) {
            apiUrl = apiUrl.slice(0, apiUrl.length - 1);
        }


        const range = req.headers.get('range');
        const headers: HeadersInit = {};
        if (range) {
            headers['range'] = range;
        }


        const requestUrl = `${apiUrl}/explorer/file/${uid}/download/shared`

        const requestFile = await fetch(requestUrl, {
            method: 'GET',
            headers: {
                ...headers,
                'Accept-Language': req.headers.get('Accept-Language')?.toString() ?? 'en'
            }
        })

        const responseHeaders = new Headers(requestFile.headers);
        return new NextResponse(requestFile.body, { status: requestFile.status, headers: responseHeaders });
    }
    catch (e) {
        if (e instanceof CrepenBaseError) {
            return NextResponse.json(e.toJson(), { status: e.statusCode })
        }
        else {
            const err = new CrepenBaseError('Unknown Error', 501, e as Error);
            return NextResponse.json(err.toJson(), { status: err.statusCode })
        }
    }
}