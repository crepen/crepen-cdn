import { IsNotEmpty } from "class-validator";

export class UserUpdateDto {
    // @IsNotEmpty({message : '아이디가 없습니다.'})
    id : string | undefined;

    // @IsNotEmpty({message : '비밀번호가 없습니다.'})
    password : string | undefined;

    
    name : string | undefined;
    email : string | undefined;
}