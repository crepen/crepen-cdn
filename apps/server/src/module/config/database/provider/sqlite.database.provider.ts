import { ConfigService } from "@nestjs/config";
import { DataSource } from "typeorm";
import { DataSourceProviderInterface } from "./interface.database.provider";

import { join } from "path";
import * as os from 'os';
import { CrepenDataPath } from "@crepen-nest/lib/enum/os-path.enum";

export class SQLiteDataSourceProvider implements DataSourceProviderInterface {
    constructor() {
        let databasePath = '/';

        if (os.type() === 'Linux') {
            databasePath = CrepenDataPath.DATA_DIR_PATH_LINUX;
        }
        else if (os.type() === 'Windows_NT') {
            databasePath = CrepenDataPath.DATA_DIR_PATH_WIN;
        }
        else if (os.type() === 'Darwin') {
            databasePath = CrepenDataPath.DATA_DIR_PATH_MAC;
        }

        const entityDir = join(__dirname, '../../../../app/**/*.local.entity{.ts,.js}')
        const moduleEntityDir = join(__dirname, '../../../../module/entity/**/*.local.entity{.ts,.js}')


        this.dataSource = new DataSource({
            type: 'sqlite',
            database: join(databasePath, 'crepen_cdn.sqlite'),
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