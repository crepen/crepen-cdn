import { StringUtil } from "@web/lib/util/StringUtil";
import { BaseUrlUndefinedFetchError } from "./error/BaseUrlUndefinedFetchError";
import { RequestMethodUndefinedFetchError } from "./error/RequestMethodUndefinedFetchError";
import { ConnectFailedFetchError } from "./error/ConnectFailedFetchError";

export type FetchApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
export type FetchApiResultType = 'JSON' | "BLOB"

export interface FetchApiServiceOptions {
    language?: string,
    token?: string
}

export class FetchApi {
    constructor(baseUrl?: string) {
        this.baseUrl = baseUrl;
    }

    private propHeader?: Record<string, string> = {} as Record<string, string>


    private requestBody?: string | FormData;
    private requestUrl?: string;
    private requestMethod?: FetchApiMethod;

    private baseUrl?: string;
    private option?: FetchApiServiceOptions = undefined;




    static instance = (baseUrl?: string) => {
        const instance = new FetchApi(baseUrl ?? process.env.API_URL)
        return instance;
    }


    setOptions = (option: FetchApiServiceOptions) => {
        this.option = option;
        return this;
    }
    setHeaders = (header: Record<string, string>) => {
        this.propHeader = { ...(this.propHeader ?? {}), ...header };
        return this;
    }
    setMethod = (method: FetchApiMethod) => {
        this.requestMethod = method;
        return this;
    }
    setUrl = (url: string) =>{
         this.requestUrl = url;
         return this;
    }

    setBody = (data: unknown) => {
        let requestBody: FormData | string | undefined = undefined;
        if (data !== undefined && data !== null) {
            if (data instanceof FormData) {
                requestBody = data;
            }
            else {
                if (data instanceof Object) {
                    requestBody = JSON.stringify(data);
                    this.propHeader = {
                        ...(this.propHeader ?? ({} as Record<string, string>)),
                        ...{ 'Content-Type': 'application/json' }
                    };
                }
            }
        }

        this.requestBody = requestBody;
        return this;
    }



    private getHeader = async (): Promise<Headers> => {

        const headers: Headers = new Headers();

        //#region HEADER:PROP

        if (this.propHeader) {
            for (const [key, value] of Object.entries(this.propHeader)) {
                if (!StringUtil.isEmpty(key) && !StringUtil.isEmpty(value)) {
                    headers.set(key, value);
                }
            }
        }

        //#endregion HEADER:PROP

        //#region HEADER:ACCEPT-LANGUAGE

        let language: string | undefined = undefined;

        try {
            if (this.option?.language) {
                language = this.option.language;
                headers.set('Accept-Language', this.option.language);
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        catch (e) { /** empty */}

        headers.set('Accept-Language', language ?? '');

        //#endregion HEADER:ACCEPT-LANGUAGE

        //#region HEADER:AUTHORIZATION

        if (this.option?.token) {
            headers.set("Authorization", `Bearer ${this.option.token}`);
        }

        //#endregion HEADER:AUTHORIZATION

        return headers;
    }


    getResponse = async (type?: FetchApiResultType) => {

        //#region VALIDATION CHECK

        if (StringUtil.isEmpty(this.baseUrl)) {
            throw new BaseUrlUndefinedFetchError();
        }
        else if (StringUtil.isEmpty(this.requestMethod)) {
            throw new RequestMethodUndefinedFetchError();
        }

        //#endregion

        const fetchOption: RequestInit = {
            headers: await this.getHeader(),
            method: this.requestMethod,
            body: this.requestBody,
            keepalive : true
        }

        try {
            const fetchData = await fetch(
                new URL(this.requestUrl ?? '/', this.baseUrl),
                fetchOption
            )

            if (type === 'BLOB') {
                const fetchBlob = await fetchData.blob();
                return new FetchApiResult(fetchData.status, fetchBlob, 'BLOB');
            }
            else {
                const fetchJson = await fetchData.json();
                return new FetchApiResult(fetchData.status, fetchJson, 'JSON');
            }


        }
        catch (e) {
            
            throw new ConnectFailedFetchError();
        }
    }
}

export class FetchApiResult {
    constructor(statusCode: number, jsonData: object | undefined | null, resultType: FetchApiResultType) {
        this.statusCode = statusCode;
        this.jsonData = jsonData ?? undefined;
        this.resultType = resultType;
    }

    statusCode: number;
    jsonData: object | undefined;
    resultType: FetchApiResultType;

}


