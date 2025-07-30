import { CrepenFetchExtenstion } from "../common/api/CrepenFetchExtension";
import { FetchApi } from "../common/api/FetchApiService";
import { LoginRequestEntity, LoginResultEntity } from "../entity/repository/AuthRepository";
import { CommonApiOptions } from "../entity/CommonApi";
import { CheckLoginStateResponse, RefreshUserTokenResponse } from "../entity/data-service/AuthService";

/**
 * 인증 관리 서비스
 */
export class AuthRepository {
    static login = async (prop: LoginRequestEntity, options?: CommonApiOptions) => {
        try {

            const formData = new FormData();
            formData.set('id', prop.id ?? '');
            formData.set('password', prop.password ?? '');

            const result = await FetchApi.instance()
                .setMethod('POST')
                .setUrl('/auth/login')
                .setBody(formData)
                .setOptions({
                    token: options?.token,
                    language: options?.language
                })
                .getResponse();


            return CrepenFetchExtenstion.convertCrepenResult<LoginResultEntity>(result);
        }
        catch (e) {
            return CrepenFetchExtenstion.getDefaultErrorResult<LoginResultEntity>(e as Error);
        }

    }

    static refreshUserToken = async (options?: CommonApiOptions) => {
        try {

            const result = await FetchApi.instance()
                .setMethod('POST')
                .setUrl('/auth/token')
                .setOptions({
                    token: options?.token,
                    language: options?.language
                })
                .getResponse();


            return CrepenFetchExtenstion.convertCrepenResult<RefreshUserTokenResponse>(result);
        }
        catch (e) {
            return CrepenFetchExtenstion.getDefaultErrorResult<RefreshUserTokenResponse>(e as Error);
        }
    }

    static CheckTokenExpired = async (tokenType: 'access_token' | 'refresh_token', options?: CommonApiOptions) => {
        try {

            const result = await FetchApi.instance()
                .setMethod('POST')
                .setUrl(`/auth/token/exp?type=${tokenType}`)
                .setOptions({
                    token: options?.token,
                    language: options?.language
                })
                .getResponse();


            return CrepenFetchExtenstion.convertCrepenResult<CheckLoginStateResponse>(result);
        }
        catch (e) {
            return CrepenFetchExtenstion.getDefaultErrorResult<CheckLoginStateResponse>(e as Error);
        }
    }
}