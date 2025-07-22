import { ConfigService } from "@nestjs/config";
import { join } from "path";
import { DataSource } from "typeorm";
import * as os from 'os';
import { CrepenDataPath } from "@crepen-nest/lib/enum/os-path.enum";

export class DefaultDataSource {

    constructor(config: ConfigService<unknown, boolean>) {

        const entityDir = __dirname + '/../../app/**/entity/*.entity{.ts,.js}'

        this.dataSource = new DataSource({
            type: 'mariadb',
            host: config.get<string>('db.host'),
            port: config.get<number>('db.port'),
            database: config.get<string>('db.database'),
            username: config.get<string>('db.username'),
            password: config.get<string>('db.password'),
            entities: [entityDir],
            synchronize: false,
            // logging: configService.get<boolean>('db.logging'),
            timezone: '+00:00'
        })
    }

    dataSource: DataSource;


    static getDataSource = async (config: ConfigService<unknown, boolean>) => {

        const instance = new DefaultDataSource(config);
        return instance.dataSource.initialize();
    }

    static testConnection = async (config: ConfigService<unknown, boolean>) => {
        try {
            const dataSource = await this.getDataSource(config);
            await dataSource.destroy();
            return true;
        }
        catch (e) {
            return false;
        }
    }
}