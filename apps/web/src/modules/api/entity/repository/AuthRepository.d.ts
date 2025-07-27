export interface LoginRequestEntity {
    id?: string,
    password?: string
}


export interface LoginResultEntity {
    accessToken?: string,
    refreshToken?: string,
    expireTime?: number
}