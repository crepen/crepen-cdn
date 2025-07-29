import { SystemError, SystemErrorOptions } from "../system.error";

export class InitLocalDatabaseInitializeError extends SystemError {
    constructor(errorOptions ? : SystemErrorOptions) {
        super('Local Init Error : Local DB Initialize Failed.' , errorOptions)
    }
}