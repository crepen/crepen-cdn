import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class AddGroupRequestDto {
    @IsNotEmpty()
    groupName: string;

    @IsOptional()
    @IsString()
    parentGroupUid: string;

    @IsOptional()
    @MaxLength(200)
    description?: string;

}