import { CrepenCommonError } from "@web/lib/common/common-error";
import { StringUtil } from "@web/lib/util/string.util";
import { CrepenAuthOpereationService } from "@web/services/operation/auth.operation.service";
import { CrepenCookieOperationService } from "@web/services/operation/cookie.operation.service";
import { NextRequest, NextResponse } from "next/server";

// export const runtime = 'node';

export const POST = async (req: NextRequest, res: NextResponse) => {
    try {
        const { searchParams } = new URL(req.url);

        const uid = searchParams.get('uid');

        if(StringUtil.isEmpty(uid)){
            throw new CrepenCommonError('대상 폴더를 찾을 수 없습니다.')
        }

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

        const bodyDataStr = await req.text();
        console.log('------>',bodyDataStr)
        let bodyData = {};

        if(!StringUtil.isEmpty(bodyDataStr)){
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
            throw new CrepenCommonError(data.message);
        }



        return NextResponse.json({
            success: true,
            message: data.message
        });
    }
    catch (e) {
        console.log('ROUTE ERROR', e);

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