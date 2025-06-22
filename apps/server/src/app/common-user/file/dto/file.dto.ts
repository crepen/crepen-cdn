import { IsFormDataValueBoolean, IsFormDataValueBooleanConstraint } from "@crepen-nest/lib/decorator/form-value-boolean.decorator";
import { StringUtil } from "@crepen-nest/lib/util/string.util";
import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { isBoolean, IsBoolean, IsNotEmpty, Validate, ValidateIf } from "class-validator";

export class AddFileDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'cloud_file.FILE_ADD_FAILED_TITLE_UNDEFINED' })
    fileTitle: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'cloud_file.FILE_ADD_FAILED_PARENT_FOLDER_UID_UNDEFINED' })
    parentFolderUid: string;

    @ApiProperty()
    @Transform(({ value }) => {

        if (value === 'true' || value === 'false') {
            return value === 'true'
        }
        else if(StringUtil.isEmpty(value)){
            return false;
        }
        else {
            return value as string;
        }
    })
    @IsFormDataValueBoolean({ message: 'cloud_file.FILE_ADD_FAILED_OPTION_BOOLEAN_TYPE' })
    optionShared: boolean;


}

export class RelationFileDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'cloud_file.FILE_REL_FAILED_FILE_UID_UNDEFINED' })
    fileUid : string;

    @ApiProperty()
    @IsNotEmpty({ message: 'cloud_file.FILE_REL_FAILED_FOLDER_UID_UNDEFINED' })
    folderUid : string;

    @ApiProperty()
    @IsNotEmpty({ message: 'cloud_file.FILE_REL_FAILED_FILE_TITLE_UNDEFINED' })
    fileTitle : string;
}