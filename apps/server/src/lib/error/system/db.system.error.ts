
/** @deprecated */
export class CrepenSystemDatabaseError extends Error{
    constructor(message : string , context : string , options? : ErrorOptions){
        super(message , options)
        this.errorContext = context;
    }

    errorContext : string;



    static LOCAL_DB_CONNECT_FAILED = new CrepenSystemDatabaseError('Local DB Connect Failed (SQLite)' , 'SYSTEM - DB' )
}



