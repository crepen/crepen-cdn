import { CrepenLocaleHttpException } from "@crepen-nest/lib/exception/crepen.http.exception";
import { HttpStatus } from "@nestjs/common";

export class CrepenFolderError extends CrepenLocaleHttpException{

    

    static FOLDER_NOT_FOUND = new CrepenFolderError('cloud_folder' , 'FOLDER_LOAD_FOLDER_TARGET_NOT_FOUND' , HttpStatus.NOT_FOUND)
}

