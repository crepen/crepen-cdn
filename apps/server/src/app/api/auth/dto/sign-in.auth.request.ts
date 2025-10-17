import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { GrantTypeEnum } from "../enum/grant-type.auth.request";

export class SignInRequest {

    @ApiProperty({ name: "grant_type" })
    @IsNotEmpty({ message: 'api_auth.PARAM.NOT_DEFINED.GRANT_TYPE' })
    @IsEnum(GrantTypeEnum, { message: 'api_auth.PARAM.UNVALIDEATE.GRANT_TYPE' })
    @Expose({ name: 'grant_type' })
    grantType: GrantTypeEnum;

    @ApiProperty({ name: 'id' })
    // @IsNotEmpty({message : 'api_auth.PARAM.NOT_DEFINED.ID'})
    @IsOptional()
    @Expose({ name: 'id' })
    id: string;

    @ApiProperty({ name: 'password' })
    @Expose({ name: 'password' })
    @IsOptional()
    // @IsNotEmpty({message : 'api_auth.PARAM.NOT_DEFINED.PASSWORD'})
    password: string;


}