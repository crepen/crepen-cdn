import { CrepenBaseError } from "@web/modules/common-1/error/CrepenBaseError";
import { CrepenRouteError } from "@web/modules/common-1/error/CrepenRouteError";
import { CrepenAuthOpereationService } from "@web/modules/crepen/service/auth/CrepenAuthOpereationService";
import { CrepenCookieOperationService } from "@web/services/operation/cookie.operation.service";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (req: NextRequest , res : NextResponse) => {
    try {
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
                'x-file-type': encodeURIComponent(file.type),
                'x-file-title' : encodeURIComponent(formData.get('title')?.toString() ?? ''),
                'x-file-save-folder' : encodeURIComponent(formData.get('folderUid')?.toString() ?? '')
            },
            body: stream, // TS 오류 무시
            // duplex 필요!
            duplex: "half",
        } as never);

        const data = await response.json()

        if (data.success !== true) {
            throw new CrepenBaseError(data.message, data.statusCode);
        }



        return NextResponse.json({
            success: true,
            message: data.message,
            uid: data.data
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

