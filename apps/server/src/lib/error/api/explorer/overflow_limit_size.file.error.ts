import { CommonError } from "../../common.error";

export class ExplorerFileSizeLimitOverflowError extends CommonError{
    constructor() {
        super(
            'api_file.FILE_NOT_UPLOADED',
            403,
            'FILE_NOT_UPLOADED'
        )
    }
}