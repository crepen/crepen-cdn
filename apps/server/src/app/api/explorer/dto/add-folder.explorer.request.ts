import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNotEmpty } from "class-validator";

export class ExplorerAddFolderRequest {
    @ApiProperty({
        example : "Folder Name",
        name : 'folder_name'
    })
    @IsNotEmpty({
        message : 'api_folder.PARAM_NOT_DEFINED_FOLDER_NAME'
    })
    folderName: string;
}