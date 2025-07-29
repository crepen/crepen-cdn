import { CommonError } from "../../common.error";

export class FileNotFoundError extends CommonError {
    constructor() {
        super(
            'api_file.FILE_NOT_FOUND',
            404,
            'FILE_NOT_FOUND'
        )
    }
}