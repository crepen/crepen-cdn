import { ResponseCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
import { AuthSessionLoadUserDataError } from "@web/modules/common/error/AuthSessionLoadUserDataError";
import { AuthSessionRefreshError } from "@web/modules/common/error/AuthSessionRefreshError";
import { AuthSessionLoginError } from "@web/modules/common/error/AuthSessionLoginError";
import { AuthSessionReadError } from "@web/modules/common/error/AuthSessionReadError";
import { AuthSessionSaveError } from "@web/modules/common/error/AuthSessionSaveError";
import { CryptoSymmenticUtil } from "@web/lib/util/CryptoUtil";
import { FolderEntity } from "@web/lib/modules/api-server/entity/object/FolderEntity";
import { UserTokenEntity, UserTokenEntityInterface } from "@web/lib/modules/api-server/entity/object/TokenEntity";
import { UserInfoEntity } from "@web/lib/modules/api-server/entity/object/UserInfoEntity";
import { AuthDataService } from "@web/lib/modules/api-server/service/AuthDataService";
import { FolderDataService } from "@web/lib/modules/api-server/service/FolderDataService";
import { UserDataService } from "@web/lib/modules/api-server/service/UserDataService";

export interface AuthSessionData {
    token?: UserTokenEntity,
    user?: UserInfoEntity,
    rootFolder?: FolderEntity
}


export interface AuthSessionProviderOptions {
    cookie?: ReadonlyRequestCookies | ResponseCookies
}

export class AuthSessionProvider {
    constructor(options: AuthSessionProviderOptions) {
        this.cookieFunc = options.cookie;
    }

    SESSION_COOKIE_KEY = 'CP_SESSION'


    sessionData: AuthSessionData = {};
    private cookieFunc?: ReadonlyRequestCookies | ResponseCookies

    login = async (id: string | undefined, password: string | undefined) => {
        try {
            const request = await AuthDataService.login(id, password)

            const loginData: AuthSessionData = {
                token: request
            }

            await this.saveSession(loginData);

            return this.loadUserData();
        }
        catch (e) {
            throw AuthSessionLoginError.clone(e as Error);
        }


    }

    loadUserData = async () => {
        try {
            const data = (await this.readSession()).sessionData;

            const request = await UserDataService.getUserInfo({ token: data.token?.accessToken });
            const rootFolderRequest = await FolderDataService.getUserRootFolder({ token: data.token?.accessToken });
            data.user = request;
            data.rootFolder = rootFolderRequest;



            await this.saveSession(data);
            return this;
        }
        catch (e) {
            throw AuthSessionLoadUserDataError.clone(e as Error);
        }
    }

    refresh = async () => {
        try {
            const data = (await this.readSession()).sessionData;


            const request = await AuthDataService.refreshUserToken({ token: data.token?.refreshToken });

            data.token = request;

            const userInforequest = await UserDataService.getUserInfo({ token: request.accessToken });
            data.user = userInforequest;

            const rootFolderRequest = await FolderDataService.getUserRootFolder({ token: data.token?.accessToken });
            data.rootFolder = rootFolderRequest;

            await this.saveSession(data);

            return this;
        }
        catch (e) {
            throw AuthSessionRefreshError.clone(e as Error);
        }
    }




    applyData = (data: AuthSessionData) => {
        try {
            this.saveSession(data);
            return this;
        }
        catch (e) {
            throw AuthSessionRefreshError.clone(e as Error);
        }
    }

    reset = async () => {
        try {
            this.deleteSession();
            return this;
        }
        catch (e) {
            throw AuthSessionRefreshError.clone(e as Error);
        }
    }

    readSession = async () => {
        try {
            const sessionData = (this.cookieFunc ?? await cookies()).get(this.SESSION_COOKIE_KEY)?.value;

            const dataStr = await CryptoSymmenticUtil.instance(globalThis.crypto).decrypt(sessionData ?? '');
            const data = JSON.parse(dataStr ?? '{}') as { token?: UserTokenEntityInterface, user?: unknown , rootFolder : unknown};

            const tokenInstance = UserTokenEntity.dataToEntity(data.token?.accessToken, data.token?.refreshToken);
            const userInfoInstance = UserInfoEntity.recordToEntity(data.user);
            const rootFolderInstance = FolderEntity.recordToEntity(data.rootFolder)


            this.sessionData = {
                token: tokenInstance,
                user: userInfoInstance,
                rootFolder : rootFolderInstance
            }

            return this;
        }
        catch (e) {
            throw AuthSessionReadError.clone(e as Error)
        }
    }

    getUserSession = async () => {
        try {
            await this.readSession();

            return this.sessionData;
        }
        catch (e) {
            throw AuthSessionReadError.clone(e as Error)
        }
    }

    private deleteSession = async () => {
        try {
            const cookie: ReadonlyRequestCookies | ResponseCookies = this.cookieFunc ?? await cookies();

            cookie.delete(this.SESSION_COOKIE_KEY);
        }
        catch (e) {
            throw AuthSessionSaveError.clone(e as Error);
        }
    }


    private saveSession = async (data: AuthSessionData) => {

        try {
            const cookie: ReadonlyRequestCookies | ResponseCookies = this.cookieFunc ?? await cookies();

            const encryptAuthDataStr = await CryptoSymmenticUtil.instance(globalThis.crypto).encrypt(JSON.stringify(data));

            cookie.set(this.SESSION_COOKIE_KEY, encryptAuthDataStr);

            this.sessionData = data;
        }
        catch (e) {
            throw AuthSessionSaveError.clone(e as Error);
        }
    }






    static instance = async (options?: AuthSessionProviderOptions) => {
        return new AuthSessionProvider({ cookie: options?.cookie ?? await cookies() });
    }

    static getSessionData = async (options?: AuthSessionProviderOptions) => {
        const option : AuthSessionProviderOptions = {
            ...options,
            cookie : options?.cookie ?? await cookies()
        }
        return (await this.instance(option)).getUserSession()
    }
}

