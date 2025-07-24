import { ConfigService } from "@nestjs/config";
import { DataSource } from "typeorm";
import { DataSourceProviderInterface } from "./interface.database.provider";
import { join } from "path";

export class DefaultDataSourceProvider implements DataSourceProviderInterface {
    constructor(config: ConfigService<unknown, boolean>) {

        const entityDir = join(__dirname , '/../../../../app/**/entity/*.default.entity{.ts,.js}') 

        this.dataSource = new DataSource({
            type: 'mariadb',
            host: config.get<string>('database.default.host'),
            port: config.get<number>('database.default.port'),
            database: config.get<string>('database.default.database'),
            username: config.get<string>('database.default.username'),
            password: config.get<string>('database.default.password'),
            entities: [entityDir],
            synchronize: false,
            // logging: configService.get<boolean>('db.logging'),
            timezone: '+00:00'
        })
    }

    private dataSource: DataSource;

    static getDataSource = (config: ConfigService<unknown, boolean>) => {
        console.log(config.get('database.default'));
        const instance = new DefaultDataSourceProvider(config);
        return instance.dataSource;
    }
}