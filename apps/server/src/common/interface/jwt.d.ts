import {  TokenT, TokenType } from "src/modules/auth/interface/token"
import { UserEntity } from "src/modules/user/entity/user.entity"

export interface JwtUserPayload {
    uid: string,
    type: TokenType,
}

export interface JwtTokenData {
    payload?: JwtUserPayload,
    entity?: UserEntity,
    token? : string
}

export interface JwtUserRequest extends Request {
    user? : JwtTokenData
}