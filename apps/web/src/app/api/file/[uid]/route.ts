import { ObjectUtil } from "@web/lib/util/object.util";
import { StringUtil } from "@web/lib/util/string.util";
import { FileDataService } from "@web/modules/api/service/FileDataService";
import { CrepenBaseError } from "@web/modules/common-1/error/CrepenBaseError";
import { CrepenRouteError } from "@web/modules/common-1/error/CrepenRouteError";
import { CommonRouteError } from "@web/modules/common/error/route-error/CommonRouteError";
import { FileRouteError } from "@web/modules/common/error/route-error/FileRouteError";
import { FolderRouteError } from "@web/modules/common/error/route-error/FolderRouteError";
import { CrepenAuthOpereationService } from "@web/modules/crepen/service/auth/CrepenAuthOpereationService";
import { ServerI18nProvider } from "@web/modules/server/i18n/ServerI18nProvider";
import { AuthSessionProvider } from "@web/modules/server/service/AuthSessionProvider";
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
    const locale = req.headers.get('Accept-Language')?.toString() ?? ServerI18nProvider.getDefaultLanguage();

    try {
        const uid = (await res.params).uid;

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





        // //BODY DATA 
        // const bodyDataStr = await req.text();
        // let bodyData = {};

        // if (!StringUtil.isEmpty(bodyDataStr)) {
        //     bodyData = JSON.parse(bodyDataStr)
        // }


        // // URL
        // let apiUrl = process.env.API_URL ?? '';

        // if ((process.env.API_URL ?? '').endsWith('/')) {
        //     apiUrl = apiUrl.slice(0, apiUrl.length - 1);
        // }


        const request = await FileDataService.getFileData(uid, {
            token: sessionData.token?.accessToken
        })



        // const responseHeaders = new Headers(requestFile.headers);
        return new NextResponse(ObjectUtil.classToPlaneObject(request ?? {}));
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



export const DELETE = async (req: NextRequest, res: NextResponse & RequestContext) => {

     const locale = req.headers.get('Accept-Language')?.toString() ?? ServerI18nProvider.getDefaultLanguage();


    try {
        const uid = (await res.params).uid;

       
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

        let apiUrl = process.env.API_URL ?? '';

        if ((process.env.API_URL ?? '').endsWith('/')) {
            apiUrl = apiUrl.slice(0, apiUrl.length - 1);
        }

        const requestUrl = `${apiUrl}/explorer/file/${uid}`

        const requestFile = await fetch(requestUrl, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                'Accept-Language': locale,
                'Authorization': `Bearer ${sessionData.token?.accessToken}`,
            }
        })

        const responseHeaders = new Headers(requestFile.headers);
        return new NextResponse(requestFile.body, { status: requestFile.status, headers: responseHeaders });
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