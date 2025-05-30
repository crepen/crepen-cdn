import { UserEntity } from "@web/app/user/entity/user.entity"

////// V1
export type CrepenTokenType = 'access_token' | 'refresh_token'

export interface CrepenUserPayload {
    uid: string,
    type: CrepenTokenType,
}

export interface CrepenTokenData {
    payload?: CrepenUserPayload,
    entity?: UserEntity,
    token? : string
}

export interface JwtUserRequest extends Request {
    user? : CrepenTokenData
}

// export enum TokenType {
//     ACCESS_TOKEN = 'access_token',
//     REFRESH_TOKEN = 'refresh_token'
// }




//// V2

export interface CrepenToken {
    type : CrepenTokenType,
    value? : string,
    expireTime? : number
}

export interface CrepenTokenGroup {
    accessToken? : CrepenToken,
    refreshToken? : CrepenToken
}