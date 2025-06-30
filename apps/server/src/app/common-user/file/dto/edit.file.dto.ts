import { ObjectUtil } from "@crepen-nest/lib/util/object.util";
import { StringUtil } from "@crepen-nest/lib/util/string.util";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString, ValidateIf } from "class-validator";

export class EditFileDto {

    @ApiProperty()
    @ValidateIf((obj: EditFileDto) => !StringUtil.isEmpty(obj.fileTitle))
    @IsString({ message: 'cloud_file.FILE_TITLE_TYPE_NOT_STRING' })
    fileTitle: string;


    @ApiProperty()
    @ValidateIf((obj: EditFileDto) => !ObjectUtil.isNullOrUndefined(obj.isPublished))
    @IsBoolean({ message: 'cloud_file.FILE_SHARED_TYPE_NOT_BOOLEAN' })
    isPublished?: boolean;
}