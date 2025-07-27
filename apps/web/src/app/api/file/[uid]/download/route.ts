import { StringUtil } from "@web/lib/util/string.util";
import { CrepenBaseError } from "@web/modules/common-1/error/CrepenBaseError";
import { CrepenRouteError } from "@web/modules/common-1/error/CrepenRouteError";
import { CommonRouteError } from "@web/modules/common/error/route-error/CommonRouteError";
import { FileRouteError } from "@web/modules/common/error/route-error/FileRouteError";
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
    searchParams: Promise<any>
}

export const GET = async (req: NextRequest, res: NextResponse & RequestContext) => {
    const searchParams = req.nextUrl.searchParams;
    const resultFormat = searchParams.get('format') ?? 'file';
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


        const range = req.headers.get('range');
        const headers: HeadersInit = {};
        if (range) {
            headers['range'] = range;
        }


        const requestUrl = `${apiUrl}/explorer/file/${uid}/download`

        const requestFile = await fetch(requestUrl, {
            method: 'GET',
            headers: {
                ...headers,
                'Accept-Language': locale,
                'Authorization': `Bearer ${sessionData.token?.accessToken}`,
            }
        })



        if (resultFormat === 'json') {
            let resultData = { message: undefined, statusCode: 500 };

            try {
                resultData = await requestFile.json();
            }
            catch (e) { /* empty */ }

            if (!requestFile.ok) {
                if (!StringUtil.isEmpty(resultData.message)) {
                    throw new CommonRouteError(resultData.message, resultData.statusCode);
                }

                throw new CommonRouteError(
                    await ServerI18nProvider.getTranslationText(locale, 'common.system.UNKNOWN_ERROR'),
                    resultData.statusCode ?? 500
                );
            }
        }







        const responseHeaders = new Headers(requestFile.headers);
        return new NextResponse(requestFile.body, { status: requestFile.status, headers: responseHeaders });
    }
    catch (e) {


        if (e instanceof CommonRouteError) {
            if (resultFormat === 'json') {
                return NextResponse.json(e.toResponseJson(), { status: e.statusCode })
            }

            return new NextResponse(null, { status: e.statusCode });

        }
        else {
            if (resultFormat === 'json') {
                const err = new CommonRouteError(await ServerI18nProvider.getTranslationText(locale, 'common.system.UNKNOWN_ERROR'), 500, e as Error);
                return NextResponse.json(err.toResponseJson(), { status: err.statusCode })
            }


            return new NextResponse(null, { status: 404 });

        }
    }
}