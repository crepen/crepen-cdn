import { CommonApiOptions } from "../entity/CommonApi";
import { UserTokenEntity } from "../entity/object/TokenEntity";
import { AuthRepository } from "../repository/AuthRepository"
import { CheckLoginStateDTO } from "../entity/data-service/AuthService";
import { AuthDataServiceError } from "@web/modules/common/error/data-service/AuthDataServiceError";

export class AuthDataService {

    static login = async (id?: string, password?: string, options?: CommonApiOptions): Promise<UserTokenEntity> => {

        const request = await AuthRepository.login({
            id: id,
            password: password
        }, options);


        if(!request.success){
            throw AuthDataServiceError.errorResult(request.message);
        }


        const instance = new UserTokenEntity();
        instance.accessToken = request.data?.accessToken;
        instance.refreshToken = request.data?.refreshToken;

        return instance;
    }


    static refreshUserToken = async (options?: CommonApiOptions): Promise<UserTokenEntity> => {
        const request = await AuthRepository.refreshUserToken(options);

        if(!request.success){
            throw AuthDataServiceError.errorResult(request.message);
        }

        const instance = new UserTokenEntity();
        instance.accessToken = request.data?.accessToken;
        instance.refreshToken = request.data?.refreshToken;


        return instance;
    }


    /** @deprecated */
    static isLogin = async (accessToken?: string, refreshToken?: string): Promise<CheckLoginStateDTO> => {
        const requestAct = await AuthRepository.CheckTokenExpired('access_token', { token: accessToken });
        const requestRef = await AuthRepository.CheckTokenExpired('refresh_token', { token: refreshToken });

        return {
            tokenState: {
                act: requestAct.data?.state ?? false,
                ref: requestRef.data?.state ?? false
            }
        }
    }

}