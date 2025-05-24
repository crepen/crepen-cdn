import { CrepenApiOptions, CrepenApiResponse } from "./types/api";

type FetchType = 'GET' | 'POST' | 'PUT' | 'DELETE';

export class CrepenApiService {

    public static fetch = async <T>(method: FetchType, url: string, bodyData?: any, options?: CrepenApiOptions, reqInit?: RequestInit): Promise<CrepenApiResponse<T>> => {
        try {

            let reqHeader = reqInit?.headers;
            if (options?.token) {
                reqHeader = {
                    ...reqHeader,
                    'Authorization': `Bearer ${options.token}`
                }
            }

            if (options?.language) {
                reqHeader = {
                    ...reqHeader,
                    'Accept-Language': options?.language
                }
            }

            const fetchData = await fetch(new URL(url, process.env.API_URL ?? ''), {
                ...reqInit,
                method: method,
                body: bodyData,
                headers: reqHeader
            });

            const fetchJson = await fetchData.json();


            return {
                success: fetchJson?.success,
                message: fetchJson?.message,
                data: fetchJson?.data as T
            }
        }
        catch (e) {
            return {
                success: false,
                message: "서버와 연결이 원활하지 않습니다."
            }
        }
    }

}