export interface CrepenConfig {
    server? : {
        port? : number
    },
    db? : {
        host? : string,
        port? : number,
        database?:  string,
        username? : string,
        password? : string
    },
    secret? : {
        auth? : string,
        jwt? : string
    },
    jwt? : {
        secret? : string,
        expireTime? : string
    }
}