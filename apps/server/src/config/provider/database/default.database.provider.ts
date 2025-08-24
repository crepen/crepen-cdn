import { ConfigService } from "@nestjs/config";
import { DataSource } from "typeorm";
import { join } from "path";
import { Logger } from "@nestjs/common";
import { DataSourceProviderInterface } from "./interface.database.provider";

export class DefaultDataSourceProvider implements DataSourceProviderInterface {
    constructor(config: ConfigService<unknown, boolean>) {

        const entityDir = join(__dirname , '/../../../module/**/entity/*.default.entity{.ts,.js}') 

        Logger.log(`Load Default Database Entity : ${entityDir}`);

        this.dataSource = new DataSource({
            type: 'mariadb',
            host: config.get<string>('database.default.host'),
            port: config.get<number>('database.default.port'),
            database: config.get<string>('database.default.database'),
            username: config.get<string>('database.default.username'),
            password: config.get<string>('database.default.password'),
            entities: [entityDir],
            synchronize: true,
            // logging: configService.get<boolean>('db.logging'),
            // logging : true,
            timezone: '+00:00'
        })
    }

    private dataSource: DataSource;

    static getDataSource = (config: ConfigService<unknown, boolean>) => {
        const instance = new DefaultDataSourceProvider(config);
        return instance.dataSource;
    }
}