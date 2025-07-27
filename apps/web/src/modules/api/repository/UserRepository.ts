import { CrepenFetchExtenstion } from "../common/api/CrepenFetchExtension";
import { FetchApi } from "../common/api/FetchApiService"
import { CommonApiOptions } from "../entity/CommonApi"
import { UserInfoResultEntity } from "../entity/repository/UserRepository";

export class UserRepository {
    static getUserInfo = async (options?: CommonApiOptions) => {
        try {
            const result = await FetchApi.instance()
                .setMethod('GET')
                .setUrl('/user')
                .setOptions({
                    token: options?.token,
                    language: options?.language
                })
                .getResponse();

            return CrepenFetchExtenstion.convertCrepenResult<UserInfoResultEntity>(result);
        }
        catch (e) {
            return CrepenFetchExtenstion.getDefaultErrorResult<UserInfoResultEntity>(e as Error);
        }
    }
}