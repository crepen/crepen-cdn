import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class AuthLoginRequestDto {

    @ApiProperty({
        example : 'Account ID or Email'
    })
    @IsNotEmpty({
        message: 'cloud_auth.LOGIN_FAILED_ID_EMPTY'
    })
    id: string | undefined;

    @ApiProperty({
        example : 'Password'
    })
    @IsNotEmpty({
        message: 'cloud_auth.LOGIN_FAILED_PASSWORD_EMPTY'
    })
    password: string | undefined;


}


export class AuthTokenResponseDto {
    accessToken : string;
    refreshToken : string;
    expireTime: number;
}