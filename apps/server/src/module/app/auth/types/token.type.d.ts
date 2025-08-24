export interface TokenData {
    type : TokenTypeEnum,
    uid : string
}


export interface TokenGroup {
    accessToken: string,
    refreshToken : string
}