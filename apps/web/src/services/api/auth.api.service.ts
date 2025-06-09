import { CrepenApiService } from "@web/lib/service/api-service"
import { CrepenApiResponse } from "@web/lib/service/types/api"
import { CrepenToken } from "@web/lib/service/types/auth"

export class CrepenAuthApiService {
    static checkTokenExpired = (type: 'access_token' | 'refresh_token', token?: string): Promise<CrepenApiResponse<{ expired: boolean }>> => {
        return CrepenApiService.fetch<{ expired: boolean }>('GET', `/auth/token/exp?type=${type}`, undefined, {
            token: token
        })
    }

    static refreshToken = (token?: string) : Promise<CrepenApiResponse<CrepenToken>>=> {
        return CrepenApiService.fetch<CrepenToken>('POST', '/auth/token', undefined, {
            token: token
        })
    }
}