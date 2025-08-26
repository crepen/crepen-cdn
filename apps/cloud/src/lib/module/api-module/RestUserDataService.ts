import { TokenGroup } from "@web/lib/types/TokenGroup";
import { LocaleType } from "../locale/Locale";
import { RestAddUserProp, RestAddUserResponse, RestEditUserProp, RestUserDataValidateCheckCategory, RestUserDataValidateResponse, RestUserEditDataResponse } from "@web/lib/types/api/dto/RestUserDto";
import { FetchApi } from "../fetch/FetchApi";
import { BaseApiResultEntity } from "@web/lib/types/api/BaseApiResultEntity";
import * as humps from 'humps';

export class RestUserDataService {
    constructor(token: TokenGroup | undefined, locale: LocaleType) {
        this.token = token;
        this.language = locale
    }

    private token?: TokenGroup;
    private language?: LocaleType;

    static current = (token: TokenGroup | undefined, locale: LocaleType) => {
        return new RestUserDataService(token, locale);
    }


    addUser = async (prop: RestAddUserProp) => {
        const result = await FetchApi
            .instance(process.env.API_URL)
            .setMethod('POST')
            .setUrl('/user/add')
            .setOptions({
                language: this.language,
                token: this.token?.accessToken
            })
            .setBody({
                id: prop.userId,
                password: prop.userPassword,
                email: prop.userEmail,
                name: prop.userName
            })
            .getResponse();


        const resultData: BaseApiResultEntity<RestAddUserResponse>
            = humps.camelizeKeys(Object.assign(result.jsonData ?? {})) as BaseApiResultEntity<RestAddUserResponse>;

        return resultData
    }

    findId = async (email: string) => {
        const result = await FetchApi
            .instance(process.env.API_URL)
            .setMethod('GET')
            .setUrl(`/user/find/id?key=${encodeURIComponent(email)}`)
            .setOptions({
                language: this.language,
                token: this.token?.accessToken
            })
            .getResponse();


        const resultData: BaseApiResultEntity
            = humps.camelizeKeys(Object.assign(result.jsonData ?? {})) as BaseApiResultEntity;

        return resultData
    }

    findPassword = async (emailOrId: string, resetPasswordRedirectUrl: string) => {
        const result = await FetchApi
            .instance(process.env.API_URL)
            .setMethod('GET')
            .setUrl(`/user/find/password?key=${encodeURIComponent(emailOrId)}&reset=${resetPasswordRedirectUrl}`)
            .setOptions({
                language: this.language,
                token: this.token?.accessToken
            })
            .getResponse();


        const resultData: BaseApiResultEntity
            = humps.camelizeKeys(Object.assign(result.jsonData ?? {})) as BaseApiResultEntity;

        return resultData
    }

    validateUserData = async (categories: RestUserDataValidateCheckCategory[], prop: RestAddUserProp) => {

        const result = await FetchApi
            .instance(process.env.API_URL)
            .setMethod('POST')
            .setUrl(`/user/add/validate?category=${categories.join(',')}`)
            .setBody({
                id: prop.userId,
                password: prop.userPassword,
                email: prop.userEmail,
                name: prop.userName
            })
            .setOptions({
                language: this.language,
                token: this.token?.accessToken
            })
            .getResponse();


        const resultData: BaseApiResultEntity<RestUserDataValidateResponse>
            = humps.camelizeKeys(Object.assign(result.jsonData ?? {})) as BaseApiResultEntity<RestUserDataValidateResponse>;

        return resultData
    }

    editUserData = async (categories: RestUserDataValidateCheckCategory[], prop: RestEditUserProp) => {
        const result = await FetchApi
            .instance(process.env.API_URL)
            .setMethod('PUT')
            .setUrl(`/user?edit=${categories.join(',')}`)
            .setBody({
                email: prop.userEmail,
                name: prop.userName
            })
            .setOptions({
                language: this.language,
                token: this.token?.accessToken
            })
            .getResponse();


        const resultData: BaseApiResultEntity<RestUserEditDataResponse>
            = humps.camelizeKeys(Object.assign(result.jsonData ?? {})) as BaseApiResultEntity<RestUserEditDataResponse>;

        return resultData

    }
}