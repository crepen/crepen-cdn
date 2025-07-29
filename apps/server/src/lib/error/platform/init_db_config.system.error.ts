import { SystemError, SystemErrorOptions } from "../system.error";

export class InitLoadDatabaseConfigError extends SystemError{
    constructor(errorOptions? : SystemErrorOptions){
        super('Local Init Error : Load Database Config Failed' , errorOptions)
        
    }
}