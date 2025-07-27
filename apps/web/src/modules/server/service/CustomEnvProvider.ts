import { ResponseCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import urlJoin from "url-join";

interface CustomEnvProviderCookieOptions {
    cookie?: ResponseCookies | ReadonlyRequestCookies
}

interface CustomEnvProviderHeaderOptions {
    header?: ReadonlyHeaders | Headers
}


export class CustomEnvProvider {
    constructor() {

    }





    static getBasePath = async (path?: string, options?: CustomEnvProviderHeaderOptions) => {

        let header;
        if (options?.header) {
            header = options.header;
        }
        else {
            const headerLib = await import('next/headers');
            header = await headerLib.headers();
        }

        const basePath = header.get('x-cp-basepath')?.toString();


        return urlJoin(basePath ?? '/', path ?? '');
    }

    static setBasePath = async (value: string, options?: CustomEnvProviderHeaderOptions) => {

        let header;
        if (options?.header) {
            header = options.header;
        }
        else {
            const headerLib = await import('next/headers');
            header = await headerLib.headers();
        }

        header.set('x-cp-basepath', value);
    }
}