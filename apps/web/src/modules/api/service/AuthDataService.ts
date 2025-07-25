import { CheckLoginStateDTO, RefreshUserTokenDTO, UserLoginDTO, UserLoginRequest } from "../entity/AuthService";
import { AuthRepository } from "../repository/AuthRepository"

export class AuthDataService {

    static login = async (prop: UserLoginRequest): Promise<UserLoginDTO> => {

        const request = await AuthRepository.login(prop);

        return {
            state: request.success,
            message: request.message,
            accessToken: request.data?.accessToken,
            expireTime: request.data?.expireTime,
            refreshToken: request.data?.refreshToken
        }
    }


    static refreshUserToken = async (token?: string): Promise<RefreshUserTokenDTO> => {
        const request = await AuthRepository.refreshUserToken(token);

        return {
            state: request.success,
            message: request.message,
            accessToken: request.data?.accessToken,
            expireTime: request.data?.expireTime,
            refreshToken: request.data?.refreshToken
        }
    }


    static isLogin = async (accessToken?: string, refreshToken?: string): Promise<CheckLoginStateDTO> => {
        const requestAct = await AuthRepository.CheckTokenExpired(accessToken, 'access_token');
        const requestRef = await AuthRepository.CheckTokenExpired(refreshToken, 'refresh_token');

        return {
            tokenState: {
                act: requestAct.data?.state ?? false,
                ref: requestRef.data?.state ?? false
            }
        }
    }

}