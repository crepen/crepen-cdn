import { CrepenCommonHttpLocaleError } from "@crepen-nest/lib/error-bak/http/common.http.error";
import { HttpStatus } from "@nestjs/common";

export class CrepenFolderError extends CrepenCommonHttpLocaleError {

    constructor(messageCode: string, status: number) {
        super('cloud_folder', messageCode, status);
    }

    static FOLDER_UID_UNDEFINED = new CrepenFolderError('FOLDER_UID_UNDEFINED_B', HttpStatus.BAD_REQUEST);
    static FOLDER_NOT_FOUND = new CrepenFolderError('FOLDER_NOT_FOUND_B', HttpStatus.NOT_FOUND);
    static FOLDER_ACCESS_DENIED = new CrepenFolderError('FOLDER_ACCESS_DENIED_B', HttpStatus.UNAUTHORIZED);
}

