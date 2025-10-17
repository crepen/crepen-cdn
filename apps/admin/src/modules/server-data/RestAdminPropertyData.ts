import urlJoin from "url-join";
import { RestAdminSitePropretiesResult } from "./types/response/RestPropertyResponse";
import { RestDataResult } from "./types/RestData";
import * as humps from 'humps'
import { DatabaseEntity } from "@web/types/DatabaseEntity";


export class RestAdminPropertyData {
    constructor(serverUrl: string) {
        this._apiUrl = serverUrl;
    }

    private _apiUrl;

    static init = (serverUrl: string) => {
        return new RestAdminPropertyData(serverUrl);
    }

    getSiteProperties = async (accessToken?: string) => {
        let resultData: RestDataResult<RestAdminSitePropretiesResult> = {
            success: false,
            status: 500,
            statusCode: 'UNKNOWN_ERROR',
            timestamp: new Date().toUTCString()
        }

        const url = urlJoin(this._apiUrl, '/admin/setting/properties');

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

            const camelResult = humps.camelizeKeys<RestDataResult<RestAdminSitePropretiesResult>>(resultJson)

            resultData = camelResult;
        }
        catch (_ignore) {/** empty */ }

        resultData.success = result.ok;
        resultData.status = result.status;

        return resultData;
    }


    updateDatabase = async (accessToken?: string, databaseEntity?: DatabaseEntity) => {
        let resultData: RestDataResult = {
            success: false,
            status: 500,
            statusCode: 'UNKNOWN_ERROR',
            timestamp: new Date().toUTCString()
        }

        const url = urlJoin(this._apiUrl, '/admin/setting/database');

        const apiResult = () => fetch(url, {
            method: 'PUT',
            body: JSON.stringify({
                host: databaseEntity?.host,
                port: databaseEntity?.port,
                username: databaseEntity?.username,
                password: databaseEntity?.password,
                database: databaseEntity?.database
            }),
            headers: {
                'Authorization': `Bearer ${accessToken ?? 'NFD'}`,
                'Content-Type': 'application/json'
            }
        })


        const result = await apiResult();




        try {
            const resultJson = await result.json();

            const camelResult = humps.camelizeKeys<RestDataResult>(resultJson)

            resultData = camelResult;
        }
        catch (_ignore) {/** empty */ }

        resultData.success = result.ok;
        resultData.status = result.status;

        return resultData;
    }
}