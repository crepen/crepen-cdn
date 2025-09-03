import { LocaleConfig } from "@web/lib/config/LocaleConfig";
import { CustomRouteError } from "@web/lib/error/CustomRouteError";
import { AuthProvider } from "@web/lib/module/auth/AuthProvider";
import { ServerLocaleProvider } from "@web/lib/module/locale/ServerLocaleProvider";
import { NextRequest, NextResponse } from "next/server";
import urlJoin from "url-join";

const NESTJS_API_URL = process.env.API_URL || 'http://localhost:13332';
export const dynamic = 'force-dynamic'; 

interface DownloadFileProp {
    params: Promise<{ filename: string }>
}


// DOWNLOAD PUBLISH FILE (USING TOKEN)
export const GET = async (req: NextRequest, prop: DownloadFileProp) => {

    const localeProv = ServerLocaleProvider.current(LocaleConfig);

    try {
        const fileName = (await prop.params).filename;

        const apiUrl = urlJoin(NESTJS_API_URL, `/explorer/file/download/publish/${fileName}`);

        const headers = new Headers(req.headers);


        const response = await fetch(apiUrl, {
            method: 'GET',
            body: req.body, // 요청 스트림을 직접 전달
            headers: headers,
            duplex: 'half'
        } as object);

        if (!response.ok) {
            let message: string | undefined = undefined;
            try {
                message = (await response.json()).message;
            }
            catch (e) { /** EMPTY */ }
            throw new CustomRouteError(message, response.status);
        }

        // response.headers.delete('content-disposition')

        const res = new NextResponse(response.body , {
            status : response.status,
            headers : response.headers
        })


        return res;
    }
    catch (error) {
        let message = undefined;
        let statusCode = 500;
        if (error instanceof CustomRouteError) {
            message = error.message;
            statusCode = error.statusCode ?? 500;
        }
        else {
            message = await localeProv.translate('common.system.UNKNOWN_ERROR');
        }


        console.log(error);


        return NextResponse.json({ 
            success : false,
            timestamp : new Date(),
            status_code : statusCode,
            message: message
         }, { status: statusCode });
    }

}