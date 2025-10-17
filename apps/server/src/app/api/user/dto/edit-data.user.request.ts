import { IsOptional } from "class-validator";
import { UserSupportLanguageEnum } from "../enum/user-language.enum";

export class UserEditDataRequest {


    @IsOptional()
    name : string;

    @IsOptional()
    email : string;

    @IsOptional()
    language : UserSupportLanguageEnum
}


export type UserEditCategory = 'name' | 'email' | 'language' 