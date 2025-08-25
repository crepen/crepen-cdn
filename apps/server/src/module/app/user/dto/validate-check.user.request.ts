import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class AddUserValidateCheckRequest {
    @ApiProperty({name : 'id'})
    @IsOptional()
    id : string;

    @ApiProperty({name : 'password'})
    @IsOptional()
    password : string;

    @ApiProperty({name : 'email'})
    @IsOptional()
    email : string;

    @ApiProperty({name : 'name'})
    @IsOptional()
    name : string;
}


