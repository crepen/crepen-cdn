import { CrepenSystemInstallOperationService } from "../service/system/install/CrepenSystemInstallOperationService";
import { CheckDBConnRequestDto } from "../service/system/install/dto/CheckDatabaseConnDto";

export interface SystemConnDB {
    host?: string,
    port?: number,
    username?: string,
    password?: string,
    database?: string
}

export class SystemConnDBEntity {
    constructor(prop: SystemConnDB) {
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

    static data = (connData: SystemConnDB) => {
        const instance = new SystemConnDBEntity(connData);
        return instance;
    }



    tryConn = async () => {
        const request = CrepenSystemInstallOperationService.getDBConnState(
            new CheckDBConnRequestDto({
                host: this.host,
                database: this.database,
                password: this.password,
                port: this.port,
                username: this.username
            })
        )

        return request;
    }
}