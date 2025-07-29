import { SystemError, SystemErrorOptions } from "../system.error";

export class InitLocalDatabaseConnectError extends SystemError{
    constructor(errorOptions ? : SystemErrorOptions) {
        super('Local Init Error : Local DB Connect Failed.' , errorOptions)
    }
}