import { CommonError } from "../../common.error";

export class FileCryptingAlreadyRunningError extends CommonError {
     constructor() {
        super(
            'api_file.UPDATE.ENCRYPT.QUEUE_ALERADY_RUNNING',
            403,
            'UPDATE.ENCRYPT.QUEUE_ALERADY_RUNNING'
        )
    }
}