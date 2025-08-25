import { LocaleConfig } from "@web/lib/config/LocaleConfig";
import { CustomRouteError } from "@web/lib/error/CustomRouteError";
import { RestUserDataService } from "@web/lib/module/api-module/RestUserDataService";
import { ServerLocaleProvider } from "@web/lib/module/locale/ServerLocaleProvider";
import { RestUserDataValidateCheckCategory } from "@web/lib/types/api/dto/RestUserDto";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

interface PostProp {
    params: Promise<unknown>
}

export const POST = async (req: NextRequest, prop: PostProp) => {

    const localeProv = ServerLocaleProvider.current(LocaleConfig);

    try {
        const { searchParams } = new URL(req.url);
        const data = await req.json();

        console.log(data);
        const acceptLanguage = req.headers.get('accept-language');

        const res = await RestUserDataService.current(undefined,acceptLanguage ?? LocaleConfig.defaultLocale)
            .validateUserData(
                (searchParams.get('category')?.split(',') ?? []) as RestUserDataValidateCheckCategory[],
                {
                    userEmail : data?.email,
                    userId : data?.id,
                    userName : data?.name,
                    userPassword : data?.password
                }                
            )

        if(!res.success){
            throw new CustomRouteError(res.message);
        }

        return NextResponse.json(res);
    }
    catch (error) {
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