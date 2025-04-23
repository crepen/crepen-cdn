export interface IUserData {
    uid? : string,
    loginExpireTime? : number
}

export interface CrepenUser {
    uid? : string,
    id? : string,
    password: string,
    name: string,
    email: string,
    createDate : Date
}