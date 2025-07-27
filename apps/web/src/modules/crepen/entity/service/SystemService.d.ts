export interface TryConnDatabaseDTO {
    state?: boolean
}




export interface TryConnDBRequest {
    host?: string,
    port?: number,
    username?: string,
    password?: string,
    database?: string
}


export interface ApplySystemDataRequest {
    dbHost?: string,
    dbPort?: number,
    dbUsername?: string,
    dbPassword?: string,
    dbDatabase?: string
}



export interface ServerHealthStateDTO {
    api? : boolean,
    install?: boolean,
    database?: {
        default?: boolean,
        local?: boolean
    }
}