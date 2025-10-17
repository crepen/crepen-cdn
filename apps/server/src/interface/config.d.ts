export interface CrepenConfig {
    init: boolean,
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
    path?: {
        data? : string,
        log?: string,
        config?: string
    },
    secret? : string,
    jwt? : {
        secret? : string,
        expireAct? : string,
        expireRef? : string
    },
    initAccount? : {
        id? :string,
        password? : string,
        userPassword? : string
    }
}