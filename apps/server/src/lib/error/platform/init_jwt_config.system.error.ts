import { SystemError, SystemErrorOptions } from "../system.error";

export class InitJwtConfigError extends SystemError{
    constructor(errorOptions ? : SystemErrorOptions) {
        super('Local Init Error : Load JWT Config Failed.' , errorOptions)
    }
}