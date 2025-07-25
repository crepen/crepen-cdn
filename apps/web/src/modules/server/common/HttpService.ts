import { StringUtil } from "@web/lib/util/string.util"
import { NextRequest } from "next/server";

export class HttpRequestService {

    constructor(nextRequest: NextRequest) {
        this.request = nextRequest;
    }

    request: NextRequest;



    static setRequest = (nextRequest: NextRequest) => {
        const instance = new HttpRequestService(nextRequest);
        return instance;
    }

    getLanguage = () => {

        const acceptLanguage: string | undefined | null = this.request?.headers.get('accept-language');

        if (StringUtil.isEmpty(acceptLanguage)) {
            return undefined;
        }

        try {
            return acceptLanguage!.replace(/;(.*?)$/, '')?.split(',')[1];
        }
        catch (e) {
            return undefined;
        }
    }
}