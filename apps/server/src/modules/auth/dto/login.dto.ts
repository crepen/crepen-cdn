import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator'

export class AuthLoginDto {

    @ApiProperty()
    @IsNotEmpty({
        message: 'cloud_auth.LOGIN_FAILED_ID_EMPTY'
    })
    id: string | undefined;

    @ApiProperty()
    @IsNotEmpty({
        message: 'cloud_auth.LOGIN_FAILED_PASSWORD_EMPTY'
    })
    password: string | undefined;


}