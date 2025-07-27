import { CommonRouteError } from "@web/modules/common/error/route-error/CommonRouteError";
import { FileRouteError } from "@web/modules/common/error/route-error/FileRouteError";
import { ServerI18nProvider } from "@web/modules/server/i18n/ServerI18nProvider";
import { AuthSessionProvider } from "@web/modules/server/service/AuthSessionProvider";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (req: NextRequest, res: NextResponse) => {
    const locale = req.headers.get('Accept-Language')?.toString() ?? ServerI18nProvider.getDefaultLanguage();

    try {
        let sessionData = undefined;


        try {
            sessionData = (await (await AuthSessionProvider.instance()).refresh()).sessionData;
        }
        catch (e) {
            throw new FileRouteError(
                await ServerI18nProvider.getTranslationText(locale, 'common.system.UNAUTHORIZATION'),
                401
            )
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
                'Authorization': `Bearer ${sessionData.token?.accessToken}`,
                'x-file-name': encodeURIComponent(file.name),
                'x-file-type': encodeURIComponent(file.type),
                'x-file-title': encodeURIComponent(formData.get('title')?.toString() ?? ''),
                'x-file-save-folder': encodeURIComponent(formData.get('folderUid')?.toString() ?? '')
            },
            body: stream, // TS 오류 무시
            // duplex 필요!
            duplex: "half",
        } as never);

        const data = await response.json()

        if (data.success !== true) {
            throw new FileRouteError(data.message, data.statusCode);
        }



        return NextResponse.json({
            success: true,
            message: data.message,
            uid: data.data
        });
    }
    catch (e) {
        if (e instanceof CommonRouteError) {
            return NextResponse.json(e.toResponseJson(), { status: e.statusCode })
        }
        else {
            const err = new CommonRouteError(await ServerI18nProvider.getTranslationText(locale, 'common.system.UNKNOWN_ERROR'), 500, e as Error);
            return NextResponse.json(err.toResponseJson(), { status: err.statusCode })
        }
    }

}

