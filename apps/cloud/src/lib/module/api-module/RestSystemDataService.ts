import { TokenGroup } from "@web/lib/types/TokenGroup";
import { LocaleType } from "../locale/Locale";
import { FetchApi } from "../fetch/FetchApi";
import * as humps from 'humps';
import { BaseApiResultEntity } from "@web/lib/types/api/BaseApiResultEntity";
import { SystemHealthResponse } from "@web/lib/types/api/dto/RestSystemDto";

export class RestSystemDataService {

    constructor(token: TokenGroup | undefined, locale: LocaleType) {
        this.token = token;
        this.language = locale
    }

    token?: TokenGroup;
    language?: LocaleType;

    static current = (token: TokenGroup | undefined, locale: LocaleType) => {
        return new RestSystemDataService(token, locale);
    }

    getServerHealth = async () => {

        const result = await FetchApi
            .instance(process.env.API_URL)
            .setMethod('GET')
            .setUrl('/system/health')
            .setOptions({
                language: this.language,
                token: this.token?.accessToken
            })
            .getResponse();

        const resultData: BaseApiResultEntity<SystemHealthResponse>
            = humps.camelizeKeys(Object.assign(result.jsonData ?? {})) as BaseApiResultEntity<SystemHealthResponse>;

        return resultData
    }

}