import { CrepenToken } from "../../../../../apps/web/src/services/types/object/auth.object";
import { IUserData } from "./user";

export interface ICookieData {
    user? : IUserData
}


export interface CrepenTokenCookieData extends CrepenToken{
    
}

export interface CrepenUserCookieData{
    
}