import { CrepenCommonError } from "@web/lib/common/common-error";
import { CrepenAuthOpereationService } from "@web/services/operation/auth.operation.service";
import { CrepenCookieOperationService } from "@web/services/operation/cookie.operation.service";
import { NextRequest, NextResponse } from "next/server"

export const POST = async (req: NextRequest, res: NextResponse) => {

    try {
        const renewToken = await CrepenAuthOpereationService.renewToken();

        if (renewToken.success !== true) {
            throw new CrepenCommonError('사용자 인증이 만료되었습니다. 다시 로그인해주세요.');
        }
        else {
            const applyToken = await CrepenCookieOperationService.insertTokenData(renewToken.data);
            if (applyToken.success !== true) {
                console.log(applyToken.message);
                throw new CrepenCommonError('사용자 인증이 만료되었습니다. 다시 로그인해주세요.');
            }
        }

        const bodyData = await req.json();

        console.log("POOO", bodyData)

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
            throw new CrepenCommonError(resultData.message);
        }


        return NextResponse.json({ success: true })
    }
    catch (e) {

        let message = 'Unknown Error';

        if (e instanceof CrepenCommonError) {
            message = e.message ?? message;
        }

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