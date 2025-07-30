import { CommonStateDTO } from "./CommonService"

export interface UserLoginDTO extends CommonStateDTO {
    accessToken?: string,
    refreshToken?: string,
    expireTime?: number
}




export interface RefreshUserTokenDTO extends CommonStateDTO {
    accessToken?: string,
    refreshToken?: string,
    expireTime?: number
}


export interface RefreshUserTokenResponse {
    accessToken?: string,
    refreshToken?: string,
    expireTime?: number
}


export interface CheckLoginStateDTO  {
    tokenState : {
        act : boolean,
        ref : boolean
    }
}

export interface CheckLoginStateResponse {
    state : boolean
}