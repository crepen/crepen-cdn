import { CrepenLocaleHttpException } from "@crepen-nest/lib/exception/crepen.http.exception";
import { HttpStatus } from "@nestjs/common";

export class CrepenFileError extends CrepenLocaleHttpException {


    static FILE_NOT_FOUND = new CrepenFileError('cloud_file' , 'FILE_NOT_FOUND' , HttpStatus.NOT_FOUND);
    static FILE_ACCESS_UNAUTHORIZED = new CrepenFileError('cloud_file' , 'FILE_UNAUTHORIZED' , HttpStatus.UNAUTHORIZED);
    static FILE_UID_UNDEFINED = new CrepenFileError('cloud_file' , 'FILE_UID_UNDEFINED' , HttpStatus.BAD_REQUEST)

    static FILE_REMOVE_FAILED = new CrepenFileError('cloud_file','FILE_REMOVE_FAILED' , HttpStatus.BAD_GATEWAY)
}
