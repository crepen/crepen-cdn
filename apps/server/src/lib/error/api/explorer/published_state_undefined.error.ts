import { CommonError } from "../../common.error";

export class FileUpdatePublishedStateUndefinedError extends CommonError {
    constructor() {
        super(
            'api_file.UPDATE.PUBLISHED.STATE_UNDEFINED',
            403,
            'UPDATE.PUBLISHED.STATE_UNDEFINED'
        )
    }
}