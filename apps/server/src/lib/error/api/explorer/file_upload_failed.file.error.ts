import { CommonError } from "../../common.error";

export class FileUploadFailedError extends CommonError {
    constructor() {
        super(
            'api_file.FILE_UPLOAD_FAILED',
            403,
            'FILE_UPLOAD_FAILED'
        )
    }
}