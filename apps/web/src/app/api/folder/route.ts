import { StringUtil } from "@web/lib/util/string.util";
import { CrepenRouteError } from "@web/modules/common-1/error/CrepenRouteError";
import { CommonRouteError } from "@web/modules/common/error/route-error/CommonRouteError";
import { FolderRouteError } from "@web/modules/common/error/route-error/FolderRouteError";
import { ServerI18nProvider } from "@web/modules/server/i18n/ServerI18nProvider";
import { AuthSessionProvider } from "@web/modules/server/service/AuthSessionProvider";
import { NextRequest, NextResponse } from "next/server";

// export const runtime = 'node';

export const POST = async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);

    const uid = searchParams.get('uid');
    const locale = req.headers.get('Accept-Language')?.toString() ?? ServerI18nProvider.getDefaultLanguage();

    try {




        if (StringUtil.isEmpty(uid)) {
            throw new FolderRouteError(
                await ServerI18nProvider.getTranslationText(locale , 'route.folder.FOLDER_DATA_NOT_FOUND'), 
                404
            )
        }

        let sessionData = undefined;


        try {
            sessionData = (await (await AuthSessionProvider.instance()).refresh()).sessionData;
        }
        catch (e) {
            throw new FolderRouteError(
                await ServerI18nProvider.getTranslationText(locale , 'common.system.UNAUTHORIZATION'), 
            )
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
                'Accept-Language': locale,
                'Authorization': `Bearer ${sessionData.token?.accessToken}`
            },
            body: JSON.stringify(bodyData)
        });

        const data = await response.json()

        if (data.success !== true) {
            throw new CrepenRouteError(data.message, data.statusCode);
        }



        return NextResponse.json({
            success: true,
            message: data.message
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

