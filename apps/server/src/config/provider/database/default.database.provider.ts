import { ConfigService } from "@nestjs/config";
import { DataSource } from "typeorm";
import { join } from "path";
import { Logger } from "@nestjs/common";
import { DataSourceProviderInterface } from "./interface.database.provider";
import { StringUtil } from "@crepen-nest/lib/util";
import { DynamicConfigService } from "@crepen-nest/app/config/dynamic-config/dynamic-config.service";

export class DefaultDataSourceProvider implements DataSourceProviderInterface {
    constructor(config: DynamicConfigService) {

        const entityDir = join(__dirname , '/../../../app/**/entity/*.default.entity{.ts,.js}') 

        Logger.log(`Load Default Database Entity : ${entityDir}` , 'MAIN');
        Logger.log(config.get('db.conn_str') , 'MAIN');

        this.dataSource = new DataSource({
            type: 'mariadb',
            ...config.getConfig().db,
            entities: [entityDir],
            synchronize: true,
            // logging: configService.get<boolean>('db.logging'),
            // logging : true,
            timezone: '+00:00'
        })
    }

    private dataSource: DataSource;

    static getDataSource = (config: DynamicConfigService) => {
        const instance = new DefaultDataSourceProvider(config);
        return instance.dataSource;
    }
}