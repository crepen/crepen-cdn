import { CrepenCommonHttpLocaleError } from "@crepen-nest/lib/error-bak/http/common.http.error";
import { HttpStatus } from "@nestjs/common";

export class CrepenFileError extends CrepenCommonHttpLocaleError {


    static FILE_NOT_FOUND = new CrepenFileError('cloud_file' , 'FILE_NOT_FOUND' , HttpStatus.NOT_FOUND);
    static FILE_ACCESS_UNAUTHORIZED = new CrepenFileError('cloud_file' , 'FILE_UNAUTHORIZED' , HttpStatus.FORBIDDEN);
    static FILE_UID_UNDEFINED = new CrepenFileError('cloud_file' , 'FILE_UID_UNDEFINED' , HttpStatus.BAD_REQUEST);

    static FILE_REMOVE_FAILED = new CrepenFileError('cloud_file','FILE_REMOVE_FAILED' , HttpStatus.BAD_GATEWAY);
    static FILE_EDIT_FAILED = new CrepenFileError('cloud_file','FILE_EDIT_FAILED' , HttpStatus.BAD_GATEWAY);

    static FILE_TITLE_NOT_CORRECT = new CrepenFileError('cloud_file' , 'FILE_TITLE_NOT_CORRECT' , HttpStatus.BAD_GATEWAY);
    static FILE_FOLDER_NOT_CORRECT = new CrepenFileError('cloud_file' , 'FILE_FOLDER_NOT_CORRECT' , HttpStatus.BAD_REQUEST);
}
