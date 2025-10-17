import { ResponseCookies, RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { CryptoSymmenticUtil } from "../../libs/util/CryptoUtil";
import { RestAdminAuthData } from "../server-data/RestAdminAuthData";
import { RestSessionUser } from "../server-data/types/entity/RestAuthType";

type SessionCookie = ResponseCookies | RequestCookies | ReadonlyRequestCookies;

export interface TokenGroup {
    act?: string,
    rft?: string
}

export interface CrepenSession {
    token?: TokenGroup,
    user?: RestSessionUser
}


export class SessionProvider {

    constructor(cookie: SessionCookie, writeCookie: SessionCookie | undefined = undefined) {
        this.cookieFunc = cookie;
        this.writeCookieFunc = writeCookie ?? cookie;
    }

    private cookieFunc: SessionCookie;
    private writeCookieFunc: SessionCookie;

    private _session: CrepenSession = {
        token: undefined
    }
    private _sessionKey: string = 'CPSS'

    static instance = (cookie: SessionCookie, writeCookie: SessionCookie | undefined = undefined) => {
        return new SessionProvider(cookie, writeCookie ?? cookie);
    }

    getSession = async () => {
        const sessionEnc = this.cookieFunc.get(this._sessionKey)?.value;

        try {
            const decryptSessionData = await CryptoSymmenticUtil
                .instance(globalThis.crypto)
                .decrypt(sessionEnc ?? '');

            const session = JSON.parse(decryptSessionData ?? '{}') as CrepenSession;
            this._session = session;
            return session;
        }
        catch (e) {
            return {}
        }

    }

    refreshToken = async () => {
        const dataProv = new RestAdminAuthData(process.env.API_URL);
        const session = await this.getSession();

        const res = await dataProv.refreshAuth(session.token?.rft);

        if (res.success) {
            await this.applyToken({
                act: res.data?.accessToken,
                rft: res.data?.refreshToken
            })
        }

        return {
            success: res.success,
            data: res.data,
            message: res.message
        }
    }

    signIn = async (id?: string, password?: string) => {
        const dataProv = new RestAdminAuthData(process.env.API_URL);

        const res = await dataProv.signIn(id, password);

        if (res.success) {
            await this.applyToken({
                act: res.data?.accessToken,
                rft: res.data?.refreshToken
            })

            try{
                await this.updateUserData();
            }
            catch(e){}
        }

        return {
            success: res.success,
            data: res.data,
            message: res.message
        }
    }

    updateUserData = async () => {
        await this.getSession();

        const dataProv = new RestAdminAuthData(process.env.API_URL);
        const res = await dataProv.getSessionUserData(this._session.token?.act);

        if (res.success) {
            this._session.user = res.data;
            await this.storeData();
        }

        return {
            success: res.success,
            data: res.data,
            message: res.message
        }
    }

    applyToken = async (token: TokenGroup) => {
        await this.getSession();
        this._session.token = token;
        await this.storeData();
    }

    clearSession = async () => {
        this._session = {};
        await this.storeData();
    }



    private storeData = async () => {
        const sessionData = JSON.stringify(this._session);
        const encryptSessionData = await CryptoSymmenticUtil
            .instance(globalThis.crypto)
            .encrypt(sessionData)

        this.writeCookieFunc.set(this._sessionKey, encryptSessionData)
    }

}