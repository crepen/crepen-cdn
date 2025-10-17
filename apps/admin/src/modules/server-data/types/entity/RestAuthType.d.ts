import { RestUserEntity, RestUserRole } from "./RestUserType"

export type RestSessionUserMode = 'init' | 'common'


export interface RestSessionUser {
    user?: RestUserEntity,
    mode: RestSessionUserMode,
    role: RestUserRole
}

export interface RestSessionToken {
    accessToken?: string,
    refreshToken?: string
}