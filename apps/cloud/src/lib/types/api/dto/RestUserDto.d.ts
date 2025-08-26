export interface RestAddUserProp {
    userId?: string,
    userPassword?: string,
    userName?: string,
    userEmail?: string
}

interface RestEditUserProp{
    userName? : string
    userEmail? : string
}


export interface RestAddUserResponse {
    uid : string
}



export type RestUserDataValidateCheckCategory = 'password' | 'id' | 'email' | 'name' | 'check-password';

export interface RestUserDataValidateResponse {
    id? : string,
    password?: string,
    email? :string,
    name? : string
}


export interface RestUserEditDataResponse {
    edit : RestUserDataValidateCheckCategory[]
}