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

    private token?: TokenGroup;
    private language?: LocaleType;

    static current = (token: TokenGroup | undefined, locale: LocaleType) => {
        return new RestAuthDataService(token, locale);
    }

    renewToken = async () => {
        const result = await FetchApi
            .instance(process.env.API_URL)
            .setMethod('POST')
            .setUrl('/auth/token')
            .setHeaders({
                'Content-Type': 'application/json'
            })
            .setBody({
                'grant_type': "refresh_token"
            })
            .setOptions({
                language: this.language,
                token: this.token?.refreshToken
            })
            .getResponse();

        const resultData: BaseApiResultEntity<AuthRefreshResponse>
            = humps.camelizeKeys(Object.assign(result.jsonData ?? {})) as BaseApiResultEntity<AuthRefreshResponse>;

        return resultData
    }

    login = async (id?: string, password?: string) => {
        const result = await FetchApi
            .instance(process.env.API_URL)
            .setMethod('POST')
            .setUrl('/auth/token')
            .setHeaders({
                'Content-Type': 'application/json'
            })
            .setBody({
                id: id,
                password: password,
                'grant_type': "password"
            })
            .setOptions({
                language: this.language
            })
            .getResponse();



        const resultData: BaseApiResultEntity<AuthRefreshResponse>
            = humps.camelizeKeys(Object.assign(result.jsonData ?? {})) as BaseApiResultEntity<AuthRefreshResponse>;

        return resultData
    }

}