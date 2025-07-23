import { ConfigService } from "@nestjs/config";
import { CrepenConfigProvider } from "./config-provider";
import { CrepenDatabaseProvider } from "./database-provider";


export class CrepenInitProvider {

    constructor(config: ConfigService<unknown, boolean>) {
        this.config = config;
    }

    config: ConfigService<unknown, boolean>;

    static init = async (config: ConfigService<unknown, boolean>) => {
        await CrepenDatabaseProvider.init();
        await CrepenConfigProvider.init(config);
    }
}