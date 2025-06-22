import { UserEntity } from "@crepen-nest/app/common-user/user/entity/user.entity"
import { Request as ExpressRequest } from "express"

////// V1
export type CrepenTokenType = 'access_token' | 'refresh_token'

export interface CrepenUserPayload {
    uid: string,
    type: CrepenTokenType,
    role : string
}

export interface CrepenTokenData {
    payload?: CrepenUserPayload,
    entity?: UserEntity,
    token? : string
}

export interface JwtUserRequest extends Request {
    user? : CrepenTokenData
}

export interface JwtUserExpressRequest extends ExpressRequest {
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