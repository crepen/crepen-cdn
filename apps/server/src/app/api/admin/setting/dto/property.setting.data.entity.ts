export interface CrepenPropertyDataEntity {
    db? : {
        host?: string,
        port? : number,
        username?: string,
        password?: string,
        database?: string,
        connectState?: boolean
    }
}