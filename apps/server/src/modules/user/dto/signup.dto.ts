import { IsEmail, IsNotEmpty } from "class-validator";

export class UserSignUpDto{

    @IsNotEmpty({message : '아이디가 없습니다.'})
    id : string | undefined;

    @IsNotEmpty({message : '비밀번호가 없습니다.'})
    password : string | undefined;


    @IsEmail({} , {message : "이메일 형식이 맞지 않습니다"})
    @IsNotEmpty({message : "이메일이 없습니다."})
    email : string | undefined;
}