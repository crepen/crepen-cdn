import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class SetDatabaseRequest {
    @ApiProperty({name : 'host'})
    @IsOptional()
    host : string;

    @ApiProperty({name : 'port'})
    @IsOptional()
    port : number;

    @ApiProperty({name : 'username'})
    @IsOptional()
    username : string;

    @ApiProperty({name : 'password'})
    @IsOptional()
    password : string;

    @ApiProperty({name : 'database'})
    @IsOptional()
    database : string;
}

