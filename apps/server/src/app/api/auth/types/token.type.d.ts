import { UserRoleEnum } from "../../user/enum/user-role.enum"

export type TokenMode = 'init' | 'common'



export interface TokenData {
    type : TokenTypeEnum,
    uid : string,
    mode : TokenMode,
    role : UserRoleEnum
}

export interface TokenOriginData extends TokenData {
    role : string
}

export interface TokenGroup {
    accessToken: string,
    refreshToken : string
}