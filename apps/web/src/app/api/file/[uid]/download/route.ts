import { StringUtil } from "@web/lib/util/string.util";
import { CrepenBaseError } from "@web/modules/common/error/CrepenBaseError";
import { CrepenRouteError } from "@web/modules/common/error/CrepenRouteError";
import { CrepenAuthOpereationService } from "@web/modules/crepen/service/auth/CrepenAuthOpereationService";
import { CrepenCookieOperationService } from "@web/services/operation/cookie.operation.service";
import { NextRequest, NextResponse } from "next/server";

interface RequestContext {
    params: Promise<
        {
            uid: string;
        }
    >;
    searchParams: Promise<any>
}

export const GET = async (req: NextRequest, res: NextResponse & RequestContext) => {
    const searchParams = req.nextUrl.searchParams;
    const resultFormat = searchParams.get('format') ?? 'file';

    try {
        const uid = (await res.params).uid;




        const renewToken = await CrepenAuthOpereationService.renewToken(true);
        if (renewToken.success !== true) {
            throw new CrepenRouteError(renewToken.message ?? '사용자 인증이 만료되었습니다. 다시 로그인해주세요.', 401, renewToken.innerError);
        }
        else {
            const applyToken = await CrepenCookieOperationService.insertTokenData(renewToken.data ?? undefined);
            if (applyToken.success !== true) {
                throw new CrepenRouteError(applyToken.message ?? '사용자 인증이 만료되었습니다. 다시 로그인해주세요.', 401, applyToken.innerError);
            }
        }


        let apiUrl = process.env.API_URL ?? '';

        if ((process.env.API_URL ?? '').endsWith('/')) {
            apiUrl = apiUrl.slice(0, apiUrl.length - 1);
        }


        const range = req.headers.get('range');
        const headers: HeadersInit = {};
        if (range) {
            headers['range'] = range;
        }


        const requestUrl = `${apiUrl}/explorer/file/${uid}/download`

        const requestFile = await fetch(requestUrl, {
            method: 'GET',
            headers: {
                ...headers,
                'Accept-Language': req.headers.get('Accept-Language')?.toString() ?? 'en',
                'Authorization': `Bearer ${renewToken.data?.accessToken}`,
            }
        })



        if (resultFormat === 'json') {
            let resultData = { message: undefined, statusCode: 500 };

            try {
                resultData = await requestFile.json();
            }
            catch (e) { /* empty */ }

            if (!requestFile.ok) {
                if (!StringUtil.isEmpty(resultData.message)) {
                    throw new CrepenRouteError(resultData.message, resultData.statusCode);
                }

                throw new CrepenRouteError('Failed to fetch video stream');
            }
        }







        const responseHeaders = new Headers(requestFile.headers);
        return new NextResponse(requestFile.body, { status: requestFile.status, headers: responseHeaders });
    }
    catch (e) {


        if (e instanceof CrepenBaseError) {
            if (resultFormat === 'json') {
                return NextResponse.json(e.toJson(), { status: e.statusCode })
            }

            return new NextResponse(null, { status: e.statusCode });

        }
        else {
            if (resultFormat === 'json') {
                const err = new CrepenBaseError('Unknown Error', 501, e as Error);
                return NextResponse.json(err.toJson(), { status: err.statusCode })
            }


            return new NextResponse(null, { status: 404 });

        }
    }
}