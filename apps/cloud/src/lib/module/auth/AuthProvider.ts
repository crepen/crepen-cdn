import { RequestCookies, ResponseCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { RestAuthDataService } from "../api-module/RestAuthDataService";
import { TokenGroup } from "@web/lib/types/TokenGroup";
import { SessionData, SessionRootFolder, SessionUser } from "./Session";
import { CryptoSymmenticUtil } from "@web/lib/util/CryptoUtil";
import { ServerLocaleInitializer } from "../locale/ServerLocaleInitializer";
import { LocaleConfig } from "@web/lib/config/LocaleConfig";
import { Cookies } from "@web/lib/types/Common";
import { cookies } from "next/headers";


type AuthProviderOptions = {
    readCookie?: Cookies,
    writeCookie?: Cookies
}

export class AuthProvider {

    constructor() {


    }

    private authCookieKey: string = 'CP_SESSION'


    static current = () => {
        return new AuthProvider();
    }

    setSessionRootFolder = async (folder: SessionRootFolder, options?: AuthProviderOptions) => {
        const session = await this.getSession();
        const editSessionData: SessionData = {
            ...session,
            rootFolder: folder
        }

        await this.setSession(editSessionData, options);
    }

    setSessionUser = async (user: SessionUser, options?: AuthProviderOptions) => {
        const session = await this.getSession();
        const editSessionData: SessionData = {
            ...session,
            user: user
        }

        await this.setSession(editSessionData, options);
    }

    setSessionToken = async (token: TokenGroup, options?: AuthProviderOptions) => {
        const session = await this.getSession();
        const editSessionData: SessionData = {
            ...session,
            token: token
        }

        await this.setSession(editSessionData, options);
    }

    setSession = async (session: SessionData, options?: AuthProviderOptions) => {
        const encryptSessionData = await CryptoSymmenticUtil.instance(globalThis.crypto).encrypt(JSON.stringify(session));
        (options?.writeCookie ?? await cookies()).set(this.authCookieKey, encryptSessionData, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'development' ? false : true,
            maxAge: 1800
        });
    }

    getSession = async (options?: AuthProviderOptions): Promise<SessionData | undefined> => {
        try {
            const session = (options?.readCookie ?? await cookies()).get(this.authCookieKey)?.value;
            const decryptSession = await CryptoSymmenticUtil.instance(globalThis.crypto).decrypt(session ?? '');

            return JSON.parse(decryptSession ?? '{}') as SessionData;
        }
        catch (e) {
            return undefined;
        }

    }

    refreshSession = async (options?: AuthProviderOptions): Promise<boolean> => {
        try {
            const session = await this.getSession()
            const locale = await (await ServerLocaleInitializer.current(LocaleConfig)).get({
                readCookie: options?.readCookie,
                writeCookie: options?.writeCookie
            });

            const refreshResponse = await RestAuthDataService.current(session?.token, locale).renewToken();
            if (!refreshResponse.success) {

                return false;
            }
            else {

                await this.setSessionToken({
                    accessToken: refreshResponse.data?.accessToken,
                    refreshToken: refreshResponse.data?.refreshToken
                }, options)

                return true;
            }


        }
        catch (e) {
            return false;
        }

    }
}