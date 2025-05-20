import { Allow, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class AddGroupDto {

    @IsNotEmpty()
    groupName: string;

    @IsOptional()
    @IsString()
    parentGroupUid : string;

    @IsOptional()
    @MaxLength(200)
    description? : string;

}