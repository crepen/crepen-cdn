import { TokenGroup } from "@web/lib/types/TokenGroup";
import { LocaleType } from "../locale/Locale";
import { RestAddUserProp, RestAddUserResponse } from "@web/lib/types/api/dto/RestUserDto";
import { FetchApi } from "../fetch/FetchApi";
import { BaseApiResultEntity } from "@web/lib/types/api/BaseApiResultEntity";
import * as humps from 'humps';

export class RestUserDataService {
    constructor(token: TokenGroup | undefined, locale: LocaleType) {
        this.token = token;
        this.language = locale
    }

    token?: TokenGroup;
    language?: LocaleType;

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
}