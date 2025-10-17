import { AdminAuthMode } from "@crepen-nest/module/app/admin/auth/dto/auth.admin.response"
import { UserEntity } from "@crepen-nest/module/app/user/entity/user.default.entity"
import { UserRoleEnum } from "@crepen-nest/module/app/user/enum/user-role.enum"
import { Request as ExpressRequest } from "express"

////// V1
export type CrepenTokenType = 'access_token' | 'refresh_token'

/** @deprecated */
export interface CrepenUserPayload {
    uid: string,
    type: CrepenTokenType,
    role : UserRoleEnum[],
    mode : AdminAuthMode
}

/** @deprecated */
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

/** @deprecated */
export interface CrepenTokenGroup {
    accessToken? : CrepenToken,
    refreshToken? : CrepenToken
}