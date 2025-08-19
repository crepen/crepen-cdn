import { CommonError } from "../../common.error";

export class FolderNotFoundError extends CommonError {
    constructor() {
        super(
            'api_folder.FOLDER_NOT_FOUND',
            404,
            'FOLDER_NOT_FOUND'
        )
    }
}