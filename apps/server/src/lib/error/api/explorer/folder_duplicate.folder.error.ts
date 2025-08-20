import { CommonError } from "../../common.error";

export class DuplicateFolderError extends CommonError{
      constructor() {
        super(
            'api_folder.DUPLICATE_FOLDER',
            403,
            'DUPLICATE_FOLDER'
        )
    }
}