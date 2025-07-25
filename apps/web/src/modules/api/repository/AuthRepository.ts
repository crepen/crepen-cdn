import { CrepenFetchExtenstion } from "../common/api/CrepenFetchExtension";
import { FetchApi } from "../common/api/FetchApiService";
import { CheckLoginStateResponse, RefreshUserTokenResponse, UserLoginRequest, UserLoginResponse } from "../entity/AuthService";

/**
 * 인증 관리 서비스
 */
export class AuthRepository {
    static login = async (prop: UserLoginRequest) => {
        try {

            const formData = new FormData();
            formData.set('id', prop.id ?? '');
            formData.set('password', prop.password ?? '');

            const result = await FetchApi.instance()
                .setMethod('POST')
                .setUrl('/auth/login')
                .setBody(formData)
                .getResponse();


            return CrepenFetchExtenstion.convertCrepenResult<UserLoginResponse>(result);
        }
        catch (e) {
            return CrepenFetchExtenstion.getDefaultErrorResult<UserLoginResponse>(e as Error);
        }

    }

    static refreshUserToken = async (token?: string) => {
        try {

            const result = await FetchApi.instance()
                .setMethod('POST')
                .setUrl('/auth/login')
                .setOptions({
                    token: token ?? ''
                })
                .getResponse();


            return CrepenFetchExtenstion.convertCrepenResult<RefreshUserTokenResponse>(result);
        }
        catch (e) {
            return CrepenFetchExtenstion.getDefaultErrorResult<RefreshUserTokenResponse>(e as Error);
        }
    }

    static CheckTokenExpired = async (token: string | undefined, tokenType: 'access_token' | 'refresh_token') => {
        try {

            const result = await FetchApi.instance()
                .setMethod('POST')
                .setUrl(`/auth/token/exp?type=${tokenType}`)
                .setOptions({
                    token: token ?? ''
                })
                .getResponse();


            return CrepenFetchExtenstion.convertCrepenResult<CheckLoginStateResponse>(result);
        }
        catch (e) {
            return CrepenFetchExtenstion.getDefaultErrorResult<CheckLoginStateResponse>(e as Error);
        }
    }
}