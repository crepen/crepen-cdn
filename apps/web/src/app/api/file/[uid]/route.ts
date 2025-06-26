import { CrepenCommonError } from "@web/lib/common/common-error";
import { CrepenRouteError } from "@web/lib/common/route-error";
import { StringUtil } from "@web/lib/util/string.util";
import { CrepenAuthOpereationService } from "@web/services/operation/auth.operation.service";
import { CrepenCookieOperationService } from "@web/services/operation/cookie.operation.service";
import { NextRequest, NextResponse } from "next/server";

interface RequestContext {
    params: Promise<
        {
            uid: string;
        }
    >;
}

export const POST = async (req: NextRequest, res: NextResponse & RequestContext) => {
    try {
        const uid = (await res.params).uid;




        const renewToken = await CrepenAuthOpereationService.renewToken();
        if (renewToken.success !== true) {
            throw new CrepenCommonError(renewToken.message ?? '사용자 인증이 만료되었습니다. 다시 로그인해주세요.');
        }
        else {
            const applyToken = await CrepenCookieOperationService.insertTokenData(renewToken.data);
            if (applyToken.success !== true) {
                console.log(applyToken.message);
                throw new CrepenCommonError(applyToken.message ?? '사용자 인증이 만료되었습니다. 다시 로그인해주세요.');
            }
        }


        let apiUrl = process.env.API_URL ?? '';

        if ((process.env.API_URL ?? '').endsWith('/')) {
            apiUrl = apiUrl.slice(0, apiUrl.length - 1);
        }


        const bodyDataStr = await req.text();
        console.log('------>', bodyDataStr)
        let bodyData = {};

        if (!StringUtil.isEmpty(bodyDataStr)) {
            bodyData = JSON.parse(bodyDataStr)
        }


        const requestUrl = `${apiUrl}/explorer/file/${uid}`

        const requestFile = await fetch(requestUrl, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Accept-Language': req.headers.get('Accept-Language')?.toString() ?? 'en',
                'Authorization': `Bearer ${renewToken.data?.accessToken}`,
            },
            body: JSON.stringify(bodyData)
        })

        console.log(requestFile);

        const responseHeaders = new Headers(requestFile.headers);
        return new NextResponse(requestFile.body, { status: requestFile.status, headers: responseHeaders });
        // return NextResponse.json({reqUrl : requestUrl});
    }
    catch (e) {
        let message = 'Unknown Error';

        if (e instanceof CrepenCommonError) {
            message = e.message ?? message;
        }

        // console.log(e);

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