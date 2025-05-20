export interface CrepenToken {
    accessToken : string,
    refreshToken : string,
    expireTime : number
}


export type CrepenTokenType = 'REFRESH' | 'ACCESS'