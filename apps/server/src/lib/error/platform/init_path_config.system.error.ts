import { SystemError, SystemErrorOptions } from "../system.error";

export class InitPathConfigError extends SystemError{
    constructor(errorOptions? : SystemErrorOptions){
        super('Local Init Error : Load Path Config Failed' , errorOptions)
        
    }
}