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
}

export const DELETE = async (req: NextRequest, res: NextResponse & RequestContext) => {
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

        const requestUrl = `${apiUrl}/explorer/folder/${uid}`

        const requestFile = await fetch(requestUrl, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                'Accept-Language': req.headers.get('Accept-Language')?.toString() ?? 'en',
                'Authorization': `Bearer ${renewToken.data?.accessToken}`,
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