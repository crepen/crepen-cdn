import { StringUtil } from "@web/lib/util/string.util";
import { CrepenBaseError } from "@web/modules/common/error/CrepenBaseError";
import { CrepenRouteError } from "@web/modules/common/error/CrepenRouteError";
import { CrepenAuthOpereationService } from "@web/modules/crepen/auth/CrepenAuthOpereationService";
import { CrepenCookieOperationService } from "@web/services/operation/cookie.operation.service";
import { NextRequest, NextResponse } from "next/server";

// export const runtime = 'node';

export const POST = async (req: NextRequest) => {
    try {
        const { searchParams } = new URL(req.url);

        const uid = searchParams.get('uid');

        if (StringUtil.isEmpty(uid)) {
            throw new CrepenRouteError('대상 폴더를 찾을 수 없습니다.', 404)
        }

        const renewToken = await CrepenAuthOpereationService.renewToken(true);
        if (renewToken.success !== true) {
            throw new CrepenRouteError(renewToken.message ?? '사용자 인증이 만료되었습니다. 다시 로그인해주세요.', 401, renewToken.innerError);
        }
        else {
            const applyToken = await CrepenCookieOperationService.insertTokenData(renewToken.data);
            if (applyToken.success !== true) {
                throw new CrepenRouteError(applyToken.message ?? '사용자 인증이 만료되었습니다. 다시 로그인해주세요.', 401, applyToken.innerError);
            }
        }

        const bodyDataStr = await req.text();
        let bodyData = {};

        if (!StringUtil.isEmpty(bodyDataStr)) {
            bodyData = JSON.parse(bodyDataStr)
        }

        let apiUrl = process.env.API_URL ?? '';

        if ((process.env.API_URL ?? '').endsWith('/')) {
            apiUrl = apiUrl.slice(0, apiUrl.length - 1);
        }

        const response = await fetch(`${apiUrl}/explorer/folder?uid=${uid}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Accept-Language': req.headers.get('Accept-Language')?.toString() ?? 'en',
                'Authorization': `Bearer ${renewToken.data?.accessToken}`
            },
            body: JSON.stringify(bodyData)
        });

        const data = await response.json()

        if (data.success !== true) {
            throw new CrepenRouteError(data.message , data.statusCode);
        }



        return NextResponse.json({
            success: true,
            message: data.message
        });
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

