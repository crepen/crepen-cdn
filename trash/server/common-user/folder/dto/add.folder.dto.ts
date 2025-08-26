import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, isString, IsString } from "class-validator";

export class AddFolderDto {
    @ApiProperty()
    @IsNotEmpty({message : 'cloud_folder.FOLDER_INSERT_VALIDATE_ERROR_TITLE_EMPTY'})
    folderTitle: string;

    @ApiProperty()
    @IsNotEmpty({message : 'cloud_folder.FOLDER_INSERT_VALIDATE_ERROR_PARENT_UID_EMPTY'})
    parentFolderUid: string;
}