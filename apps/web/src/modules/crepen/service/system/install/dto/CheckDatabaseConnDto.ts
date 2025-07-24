

export class CheckDBConnResultDto {

    constructor(state : boolean){
        this.state = state;
    }

    state?: boolean;
}




export interface CheckDBConnRequest {
    host?: string,
    port?: number,
    username?: string,
    password?: string,
    database?: string
}
export class CheckDBConnRequestDto {

    constructor(prop : CheckDBConnRequest){
        this.host = prop.host;
        this.port = prop.port;
        this.username = prop.username;
        this.password = prop.password;
        this.database = prop.database
    }

    host?: string;
    port?: number;
    username?: string;
    password?: string;
    database?: string;
}