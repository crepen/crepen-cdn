import { SystemError, SystemErrorOptions } from "../system.error";

export class InitSecretConfigError extends SystemError{
    constructor(errorOptions? : SystemErrorOptions){
        super('Local Init Error : Load Secret Config Failed' , errorOptions)
        
    }
}