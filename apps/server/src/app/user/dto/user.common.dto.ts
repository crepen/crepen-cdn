import { ApiProperty } from "@nestjs/swagger";
import { UserEntity } from "../entity/user.entity"
import { IsDefined, IsEmail, isNotEmpty, IsNotEmpty, IsString, ValidateIf } from "class-validator";
import { StringUtil } from "@crepen-nest/lib/util/string.util";





export class ReadUserDto {
    user: UserEntity
}

export class UpdateUserDto {
    @ApiProperty()
    @IsString()
    @ValidateIf((o : UpdateUserDto) => !StringUtil.isEmpty(o.password))
    password? : string;

    @ApiProperty()
    @ValidateIf((o : UpdateUserDto) => !StringUtil.isEmpty(o.name))
    @IsString()
    name? : string;

    @ApiProperty()
    @ValidateIf((o : UpdateUserDto) => !StringUtil.isEmpty(o.email))
    @IsEmail()
    email? : string;
}

export class AddUserDto {
    @ApiProperty({
        example: 'Add user ID'
    })
    @IsNotEmpty({
        message: 'cloud_user.USER_ADD_FAILED_ID_EMPTY'
    })
    id: string;

    @ApiProperty({
        example: 'Add user email'
    })
    @IsString()
    email?: string;

    @ApiProperty({
        example: 'Add user password'
    })
    @IsNotEmpty({
        message: 'cloud_user.USER_ADD_FAILED_PASSWORD_EMPTY'
    })
    decreptPassword: string;

    @ApiProperty({
        example: 'Add user name'
    })
    @IsNotEmpty({
        message: 'cloud_user.USER_ADD_FAILED_NAME_EMPTY'
    })
    name: string
}

