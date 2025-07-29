import { StringUtil } from "@crepen-nest/lib/util/string.util";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEmpty, IsString, ValidateIf } from "class-validator";
import { FolderEntity } from "../entity/folder.default.entity";

export class EditFolderDto {
    @ApiProperty()
    @ValidateIf((obj : EditFolderDto) => !StringUtil.isEmpty(obj.folderTitle))
    @IsString({message : 'cloud_folder.FOLDER_EDIT_VALIDATE_TITLE_NOT_STRING'})
    folderTitle : string;

}