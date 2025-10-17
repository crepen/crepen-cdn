import urlJoin from "url-join"
import { RestDataResult } from "./types/RestData";
import * as humps from 'humps'
import { RestSessionUserMode } from "./types/entity/RestAuthType";
import { RestUserEntity, RestUserRole } from "./types/entity/RestUserType";
import { RestAdminAuthTokenResult, RestAdminInitAccountStateResult, RestAdminRefreshTokenResult, RestAdminSessionUserResult } from "./types/response/RestAuthResponse";

export class RestAdminAuthData {


    constructor(serverUrl: string) {
        this._apiUrl = serverUrl;
    }

    private _apiUrl;

    getSessionUserData = async (accessToken?: string) => {
        let resultData: RestDataResult<RestAdminSessionUserResult> = {
            success: false,
            status: 500,
            statusCode: 'UNKNOWN_ERROR',
            timestamp: new Date().toUTCString()
        }

        const url = urlJoin(this._apiUrl, '/admin/auth');

        const apiResult = () => fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken ?? 'NFD'}`,
                'Content-Type': 'application/json'
            }
        })


        const result = await apiResult();




        try {
            const resultJson = await result.json();

            const camelResult = humps.camelizeKeys<RestDataResult<RestAdminSessionUserResult>>(resultJson)

            resultData = camelResult;
        }
        catch (_ignore) {/** empty */ }

        resultData.success = result.ok;
        resultData.status = result.status;

        return resultData;
    }

    signIn = async (id?: string, password?: string): Promise<RestDataResult<RestAdminAuthTokenResult>> => {
        let resultData: RestDataResult<RestAdminAuthTokenResult> = {
            success: false,
            status: 500,
            statusCode: 'UNKNOWN_ERROR',
            timestamp: new Date().toUTCString()
        }

        const url = urlJoin(this._apiUrl, '/admin/auth/token');


        try {
            const result = await fetch(url, {
                method: 'POST',
                body: JSON.stringify({
                    grant_type: 'password',
                    id: id ?? 'NFD',
                    password: password ?? 'NFD'
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            resultData.success = result.ok;
            resultData.status = result.status;

            const resultJson = await result.json();

            const camelResult = humps.camelizeKeys<RestDataResult<RestAdminAuthTokenResult>>(resultJson)

            resultData = camelResult;
        }
        catch (_ignore) {
            resultData.success = false;
            resultData.status = 500;
            resultData.message = 'COMMON.UNKNOWN_ERROR'
        }

        return resultData;
    }

    refreshAuth = async (refreshToken?: string) => {

        let resultData: RestDataResult<RestAdminRefreshTokenResult> = {
            success: false,
            status: 500,
            statusCode: 'UNKNOWN_ERROR',
            timestamp: new Date().toUTCString()
        }

        const url = urlJoin(this._apiUrl, '/admin/auth/token');


        try {
            const result = await fetch(url, {
                method: 'POST',
                body: JSON.stringify({
                    grant_type: 'refresh_token'
                }),
                headers: {
                    'Authorization': `Bearer ${refreshToken ?? 'NFD'}`,
                    'Content-Type': 'application/json'
                }
            })

            resultData.success = result.ok;
            resultData.status = result.status;

            const resultJson = await result.json();

            const camelResult = humps.camelizeKeys<RestDataResult<RestAdminRefreshTokenResult>>(resultJson)

            resultData = camelResult;
        }
        catch (_ignore) {
            resultData.success = false;
            resultData.status = 500;
            resultData.message = 'COMMON.UNKNOWN_ERROR'
        }

        return resultData;


    }

    getInitAccountState = async (accessToken?: string) => {
        let resultData: RestDataResult<RestAdminInitAccountStateResult> = {
            success: false,
            status: 500,
            statusCode: 'UNKNOWN_ERROR',
            timestamp: new Date().toUTCString()
        }

        const url = urlJoin(this._apiUrl, '/admin/auth/init-account');


        try {
            const result = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken ?? 'NFD'}`,
                    'Content-Type': 'application/json'
                }
            })

            resultData.success = result.ok;
            resultData.status = result.status;

            const resultJson = await result.json();

            const camelResult = humps.camelizeKeys<RestDataResult<RestAdminInitAccountStateResult>>(resultJson)

            resultData = camelResult;
        }
        catch (_ignore) {
            resultData.success = false;
            resultData.status = 500;
            resultData.message = 'COMMON.UNKNOWN_ERROR'
        }


        return resultData;
    }






    changeInitAccountPassword = async (accessToken?: string , password?: string) => {
        let resultData: RestDataResult = {
            success: false,
            status: 500,
            statusCode: 'UNKNOWN_ERROR',
            timestamp: new Date().toUTCString()
        }

        const url = urlJoin(this._apiUrl, '/admin/auth/init-account/password');


        try {
            const result = await fetch(url, {
                method: 'POST',
                body : JSON.stringify({
                    password : password
                }),
                headers: {
                    'Authorization': `Bearer ${accessToken ?? 'NFD'}`,
                    'Content-Type': 'application/json'
                }
            })

            resultData.success = result.ok;
            resultData.status = result.status;

            const resultJson = await result.json();

            const camelResult = humps.camelizeKeys<RestDataResult>(resultJson)

            resultData = camelResult;
        }
        catch (_ignore) {
            resultData.success = false;
            resultData.status = 500;
            resultData.message = 'COMMON.UNKNOWN_ERROR'
        }


        return resultData;
    }
}
