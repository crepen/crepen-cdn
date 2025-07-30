import { TokenGroup } from "@web/lib/types/TokenGroup";
import { LocaleType } from "../locale/Locale";
import { FetchApi } from "../fetch/FetchApi";
import * as humps from 'humps';
import { BaseApiResultEntity } from "@web/lib/types/api/BaseApiResultEntity";
import { AuthRefreshResponse } from "@web/lib/types/api/dto/RestAuthDto";

export class RestAuthDataService {

    constructor(token: TokenGroup | undefined, locale: LocaleType) {
        this.token = token;
        this.language = locale
    }

    token?: TokenGroup;
    language?: LocaleType;

    static current = (token: TokenGroup | undefined, locale: LocaleType) => {
        return new RestAuthDataService(token, locale);
    }

    renewToken = async () => {
        const result = await FetchApi
            .instance(process.env.API_URL)
            .setMethod('POST')
            .setUrl('/auth/token')
            .setOptions({
                language: this.language,
                token: this.token?.refreshToken
            })
            .getResponse();

        const resultData: BaseApiResultEntity<AuthRefreshResponse>
            = humps.camelizeKeys(Object.assign(result.jsonData ?? {})) as BaseApiResultEntity<AuthRefreshResponse>;

        return resultData
    }



}