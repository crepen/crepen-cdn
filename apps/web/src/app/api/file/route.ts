import { CrepenCommonError } from "@web/lib/common/common-error";
import { CommonUtil } from "@web/lib/util/common.util";
import { CrepenAuthOpereationService } from "@web/services/operation/auth.operation.service";
import { CrepenCookieOperationService } from "@web/services/operation/cookie.operation.service";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export const PUT = async (req: NextRequest, res: NextResponse) => {
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

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ success: false, message: 'No Files.' });
        }

        const stream = file.stream(); // ReadableStream

        let apiUrl = process.env.API_URL ?? '';

        if ((process.env.API_URL ?? '').endsWith('/')) {
            apiUrl = apiUrl.slice(0, apiUrl.length - 1);
        }

        const response = await fetch(`${apiUrl}/explorer/file/stream`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/octet-stream",
                'Accept-Language': req.headers.get('Accept-Language')?.toString() ?? 'en',
                'Authorization': `Bearer ${renewToken.data?.accessToken}`,
                'x-file-name': encodeURIComponent(file.name),
                'x-file-type': encodeURIComponent(file.type)
            },
            body: stream, // TS 오류 무시
            // duplex 필요!
            duplex: "half",
        } as any);

        const data = await response.json()

        if (data.success !== true) {
            throw new CrepenCommonError(data.message);
        }



        return NextResponse.json({
            success: true,
            message: data.message,
            uid: data.data
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

