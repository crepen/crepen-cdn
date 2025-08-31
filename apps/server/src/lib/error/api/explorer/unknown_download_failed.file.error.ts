import { CommonError } from "../../common.error";

export class DownloadUnknownError extends CommonError {
    constructor() {
        super(
            'api_file.DOWNLOAD.FAILED.UNKNOWN',
            502,
            'DOWNLOAD.FAILED.UNKNOWN'
        )
    }
}