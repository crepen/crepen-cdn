import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class AddUserRequest {
    @ApiProperty({name : 'id'})
    @IsNotEmpty({message : 'api_user.PARAM_NOT_DEFINED_USER_ID'})
    id : string;

    @ApiProperty({name : 'password'})
    @IsNotEmpty({message : 'api_user.PARAM_NOT_DEFINED_USER_ID'})
    password : string;

    @ApiProperty({name : 'email'})
    @IsNotEmpty({message : 'api_user.PARAM_NOT_DEFINED_USER_ID'})
    email : string;

    @ApiProperty({name : 'name'})
    @IsNotEmpty({message : 'api_user.PARAM_NOT_DEFINED_USER_ID'})
    name : string;
}


