import { IsNotEmpty, IsString } from 'class-validator'

export class LoginUserDto {
    
    @IsNotEmpty({
        message : '아이디가 없습니다.'
    })
    id : string | undefined;


    @IsNotEmpty({
        message : 'Password empty'
    })
    password : string | undefined;

    
}