import { LocaleConfig } from "@web/lib/config/LocaleConfig";
import { CustomRouteError } from "@web/lib/error/CustomRouteError";
import { AuthProvider } from "@web/lib/module/auth/AuthProvider";
import { ServerLocaleProvider } from "@web/lib/module/locale/ServerLocaleProvider";
import multer from "multer";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import urlJoin from "url-join";

const NESTJS_API_URL = process.env.API_URL || 'http://localhost:13332';



export const PUT = async (req: NextRequest, { params }: { params: { uid: string } }) => {

    const ss = NextResponse.json({});

    const localeProv = ServerLocaleProvider.current(LocaleConfig);


    try {
        // const upload = multer({storage : multer.memoryStorage()});

        // upload.single('file')(req , {} , () => {})

        // const formData = await req.formData();

        await AuthProvider.current().refreshSession({
            writeCookie: req.cookies,
            readCookie: req.cookies
        })

        const session = await AuthProvider.current().getSession({
            readCookie: req.cookies
        });




        const uid = (await params).uid;
        const apiUrl = urlJoin(NESTJS_API_URL, `/explorer/folder/${uid}/file/upload`)

        // console.log('gwegewg' , req.headers.get('Content-Disposition'));
        // const fileData = formData.get('file') as File;
        // console.log(`attachment; filename="${fileData.name}"`);

        const headers = new Headers(req.headers);
        // headers.append('Content-Disposition', `attachment; filename="${encodeURIComponent(fileData.name)}"`)
        headers.append('Authorization', `Bearer ${session?.token?.accessToken}`);
        // console.log('ES',(formData.get('file') as File).name)


        const response = await fetch(apiUrl, {
            method: 'PUT',
            body: req.body, // 요청 스트림을 직접 전달
            headers: headers,
            duplex: 'half'
        } as object);

        if (!response.ok) {
            let message: string | undefined = undefined;
            try {
                message = (await response.json()).message;
            }
            catch (e) { }
            throw new CustomRouteError(message, response.status);
        }

        const data = await response.json();
        const res = NextResponse.json(data);

        await AuthProvider.current().refreshSession({
            writeCookie: res.cookies,
            readCookie: req.cookies
        })

        return res;

    } catch (error) {

        console.log("🛑 ROUTE GLOBAL ERROR", error);

        let message = undefined;
        if (error instanceof CustomRouteError) {
            message = error.message;
        }
        else {
            message = await localeProv.translate('common.system.UNKNOWN_ERROR');
        }
        return NextResponse.json({ message: message }, { status: 500 });
    }

}

// 파일 크기 제한 및 기타 설정
export const config = {
    api: {
        bodyParser: false, // 파일 업로드를 위해 기본 bodyParser 비활성화
    },
};

// Next.js 13+ App Router에서 파일 크기 제한 설정
// export const maxDuration = 30; // 최대 30초
export const dynamic = 'force-dynamic'; // 동적 렌더링 강제