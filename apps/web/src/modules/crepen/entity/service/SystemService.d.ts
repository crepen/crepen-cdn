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
    database?: {
        host?: string,
        port?: number,
        username?: string,
        password?: string,
        database?: string
    }

}
