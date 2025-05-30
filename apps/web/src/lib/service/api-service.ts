import { cookies } from "next/headers";
import { CrepenApiOptions, CrepenApiResponse } from "./types/api";
import { StringUtil } from "../util/string.util";

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
            else {
                try {
                    const cookie = await cookies();
                    if (cookie.has('crepen_locale') && !StringUtil.isEmpty(cookie.get('crepen_locale')?.value)) {
                        reqHeader = {
                            ...reqHeader,
                            'Accept-Language': cookie.get('crepen_locale')!.value
                        }
                    }
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                catch (e) { /* empty */ }
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