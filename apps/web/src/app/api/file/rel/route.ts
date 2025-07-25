import { CrepenBaseError } from "@web/modules/common-1/error/CrepenBaseError";
import { CrepenRouteError } from "@web/modules/common-1/error/CrepenRouteError";
import { CrepenAuthOpereationService } from "@web/modules/crepen/auth/CrepenAuthOpereationService";
import { CrepenCookieOperationService } from "@web/services/operation/cookie.operation.service";
import { NextRequest, NextResponse } from "next/server"

export const POST = async (req: NextRequest, res: NextResponse) => {

    try {
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

        const bodyData = await req.json();

        let apiUrl = process.env.API_URL ?? '';

        if ((process.env.API_URL ?? '').endsWith('/')) {
            apiUrl = apiUrl.slice(0, apiUrl.length - 1);
        }

        const response = await fetch(`${apiUrl}/explorer/file/rel`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Accept-Language': req.headers.get('Accept-Language')?.toString() ?? 'en',
                'Authorization': `Bearer ${renewToken.data?.accessToken}`
            },
            body: JSON.stringify(bodyData)
        });

        

        const resultData = await response.json()

        if (resultData.success !== true) {
            throw new CrepenRouteError(resultData.message , resultData.statusCode);
        }


        return NextResponse.json(resultData)
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