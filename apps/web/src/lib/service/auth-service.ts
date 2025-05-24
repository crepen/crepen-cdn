import { CrepenApiService } from "./api-service";
import { CrepenApiResponse } from "./types/api";
import { CrepenToken, CrepenTokenType } from "./types/auth";
import { CrepenUser } from "./types/user";

export class CrepenAuthService {
    public static login = async (id: string | undefined, password: string | undefined): Promise<CrepenApiResponse<CrepenToken | undefined>> => {
        const formData: FormData = new FormData();
        formData.set('id', id ?? '');
        formData.set('password', password ?? '');
        return CrepenApiService.fetch<CrepenToken | undefined>('POST', '/auth/login', formData);
    }


    public static getLoginUserData = async (token? : string) : Promise<CrepenApiResponse<CrepenUser | undefined>> => {
        return CrepenApiService.fetch<CrepenUser | undefined>('GET', '/auth', undefined , {
            token : token
        });
    }

    public static refreshUserToken = async (refToken? : string) : Promise<CrepenApiResponse<CrepenToken | undefined>> => {
        return CrepenApiService.fetch<CrepenToken | undefined>('POST' , '/auth/token' , undefined , {
            token : refToken
        })
    }

    public static isTokenExpired = async (tokenType? : CrepenTokenType , token? : string) : Promise<CrepenApiResponse<{expired : boolean} | undefined>> => {

        const type = tokenType === 'ACCESS' ? 'access_token' : tokenType === 'REFRESH' ? 'refresh_token' : '';

        return CrepenApiService.fetch<{expired : boolean}>('GET' , `/auth/token/exp?type=${type}` , undefined , {
            token : token
        })
    }
}