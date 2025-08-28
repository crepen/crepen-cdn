import { ConfigService } from "@nestjs/config";
import { DataSource } from "typeorm";
import { join } from "path";
import { Logger } from "@nestjs/common";
import { DataSourceProviderInterface } from "./interface.database.provider";
import { StringUtil } from "@crepen-nest/lib/util";

export class DefaultDataSourceProvider implements DataSourceProviderInterface {
    constructor(config: ConfigService<unknown, boolean>) {

        const entityDir = join(__dirname , '/../../../module/**/entity/*.default.entity{.ts,.js}') 

        Logger.log(`Load Default Database Entity : ${entityDir}` , 'MAIN');

        this.dataSource = new DataSource({
            type: 'mariadb',
            url : StringUtil.isEmpty(config.get('db.conn_str')) ? 'mariadb://' : config.get('db.conn_str'),
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