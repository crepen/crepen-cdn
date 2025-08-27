import { DataSource } from "typeorm";
import { DataSourceProviderInterface } from "./interface.database.provider";

import { join } from "path";
import * as os from 'os';
import { GlobalDataPath } from "@crepen-nest/lib/types/enum/global-path.enum";
import { Logger } from "@nestjs/common";
import { StringUtil } from "@crepen-nest/lib/util";

export class SQLiteDataSourceProvider implements DataSourceProviderInterface {
    constructor() {
        let databasePath = process.env.CREPEN_CDN_CONFIG_DIR;

        if(StringUtil.isEmpty(databasePath)){
            databasePath = './run-obj/config'
        }

        const entityDir = join(__dirname, '../../../module/**/*.local.entity{.ts,.js}')
        const moduleEntityDir = join(__dirname, '../../../lib/types/entity/**/*.local.entity{.ts,.js}')

        this.dataSource = new DataSource({
            type: 'sqlite',
            database: join(databasePath, 'crepen_cdn_config.sqlite'),
            entities: [entityDir, moduleEntityDir],
            synchronize: true
        })
    }

    private dataSource: DataSource;

    static getDataSource = () => {
        const instance = new SQLiteDataSourceProvider();
        return instance.dataSource;
    }
}