import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class AddUserRequest {
    @ApiProperty({name : 'id'})
    @IsNotEmpty({message : 'api_user.PARAM_NOT_DEFINED_USER_ID'})
    id : string;

    @ApiProperty({name : 'password'})
    @IsNotEmpty({message : 'api_user.PARAM_NOT_DEFINED_USER_PASSWORD'})
    password : string;

    @ApiProperty({name : 'email'})
    @IsEmail({},{message : "api_user.PARAM.UNVALIDATE.EMAIL"})
    @IsNotEmpty({message : 'api_user.PARAM_NOT_DEFINED_USER_EMAIL'})
    email : string;

    @ApiProperty({name : 'name'})
    @IsNotEmpty({message : 'api_user.PARAM_NOT_DEFINED_USER_NAME'})
    name : string;
}


