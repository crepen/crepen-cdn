import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsNotEmpty, IsString, Length, ValidateIf } from "class-validator";
import { StringUtil } from "@crepen-nest/lib/util/string.util";





export class UpdateUserDto {
    @ApiProperty()
    @ValidateIf((o: UpdateUserDto) => !StringUtil.isEmpty(o.password))
    @IsString()
    @Length(12, 16, { message: 'cloud_user.USER_VALIDATE_FAILED_PASSWORD_LENGTH' })
    password?: string;

    @ApiProperty()
    @ValidateIf((o: UpdateUserDto) => !StringUtil.isEmpty(o.name))
    @IsString()
    name?: string;

    @ApiProperty()
    @ValidateIf((o: UpdateUserDto) => !StringUtil.isEmpty(o.email))
    @IsEmail({}, { message: 'common.VALIDATION_ERROR_EMAIL' })
    email?: string;

    @ApiProperty({type : 'boolean'})
    @ValidateIf((o: UpdateUserDto) => o.isLock !== undefined && o.isLock !== null )
    @IsBoolean()
    isLock? : boolean;    
}

export class AddUserDto {
    @ApiProperty({ example: 'Add user ID' })
    @IsNotEmpty({ message: 'cloud_user.USER_ADD_FAILED_ID_EMPTY' })
    id: string;

    @ApiProperty({ example: 'Add user email' })
    @IsNotEmpty({message : 'cloud_user.USER_ADD_FAILED_EMAIL_EMPTY'})
    @IsEmail({}, { message: 'common.VALIDATION_ERROR_EMAIL' })
    email: string;

    @ApiProperty({ example: 'Add user password' })
    @IsNotEmpty({ message: 'cloud_user.USER_ADD_FAILED_PASSWORD_EMPTY' })
    @Length(12, 16, { message: 'cloud_user.USER_VALIDATE_FAILED_PASSWORD_LENGTH' })
    password: string;

    @ApiProperty({ example: 'Add user name' })
    @IsNotEmpty({ message: 'cloud_user.USER_ADD_FAILED_NAME_EMPTY' })
    name: string
}

