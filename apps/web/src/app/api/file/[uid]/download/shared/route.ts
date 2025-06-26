import { CrepenCommonError } from "@web/lib/common/common-error";
import { CrepenRouteError } from "@web/lib/common/route-error";
import { CrepenAuthOpereationService } from "@web/services/operation/auth.operation.service";
import { CrepenCookieOperationService } from "@web/services/operation/cookie.operation.service";
import { NextApiRequest, NextApiResponse } from "next";
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
        

        // if (!requestFile.ok) {
        //     throw new CrepenRouteError('Failed to fetch video stream');
        // }

        const responseHeaders = new Headers(requestFile.headers);
        return new NextResponse(requestFile.body, { status: requestFile.status, headers: responseHeaders });
    }
    catch (e) {
        let message = 'Unknown Error';

        if (e instanceof CrepenCommonError) {
            message = e.message ?? message;
        }

        console.log(e);

        return NextResponse.json(
            {
                success: false,
                message: message
            },
            {
                status: 500
            }
        );
    }
}