import { CrepenToken } from "../../../../../apps/web/src/lib/service/types/auth";
import { IUserData } from "./user";

export interface ICookieData {
    user? : IUserData
}


export interface CrepenTokenCookieData extends CrepenToken{
    
}

export interface CrepenUserCookieData{
    
}