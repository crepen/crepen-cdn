export interface AuthRefreshResponse {
    accessToken? : string,
    refreshToken? : string,
    expireTime? : number
}

export interface AuthSessionUserDataResponse {
    accountId : string,
    email : string,
    name : string,
    accountState : 'unapproved' | "stable" | 'delete',
    accountLanguage? : string | null,
    isLock : boolean,
    createDate : string,
    updateDate : string
}