import { UserEntity } from "@crepen-nest/app/api/user/entity/user.default.entity";
import { UserRoleEnum } from "@crepen-nest/app/api/user/enum/user-role.enum"

/**
 * JWT 토큰 가공 데이터
 * @since 2025.09.08
 */
export interface CrepenTokenPayload {
    type? : CrepenTokenType,
    mode? : CrepenTokenMode,
    role? : UserRoleEnum[],
    iat? : number,
    exp? : number
}


/**
 * JWT 토큰 미가공 데이터
 * @since 2025.09.08
 */
export type CrepenTokenOriginPayload = CrepenTokenPayload & {
    role? : string,
    iat? : Date,
    exp? : Date
}




export interface CrepenTokenContext {
    token : string;
    payload? :  CrepenTokenPayload,
    entity? : UserEntity
}




export interface CrepenTokenGroup {
    accessToken?: string,
    refreshToken? :string
}




export enum CrepenTokenType {
    ACCESS_TOKEN = 'access_token',
    REFRESH_TOKEN = 'refresh_token'
}

export enum CrepenTokenMode {
    INIT = 'init',
    COMMON = 'common'
}
