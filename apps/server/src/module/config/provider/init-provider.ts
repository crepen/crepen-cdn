import { ConfigService } from "@nestjs/config";
import { CrepenConfigProvider } from "./config-provider";
import { CrepenDatabaseProvider } from "./database-provider";


export class CrepenInitProvider {

    constructor(config: ConfigService<unknown, boolean>) {
        this.config = config;
    }

    config: ConfigService<unknown, boolean>;

    static init = async (config: ConfigService<unknown, boolean>) => {
        await CrepenConfigProvider.init(config);
        await CrepenDatabaseProvider.init(config);

    }


    


    
}