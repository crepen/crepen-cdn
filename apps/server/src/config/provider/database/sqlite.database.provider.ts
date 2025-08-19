import { DataSource } from "typeorm";
import { DataSourceProviderInterface } from "./interface.database.provider";

import { join } from "path";
import * as os from 'os';
import { GlobalDataPath } from "@crepen-nest/lib/types/enum/global-path.enum";
import { Logger } from "@nestjs/common";

export class SQLiteDataSourceProvider implements DataSourceProviderInterface {
    constructor() {
        let databasePath = '/';

        if (os.type() === 'Linux') {
            databasePath = GlobalDataPath.DATA_DIR_PATH_LINUX;
        }
        else if (os.type() === 'Windows_NT') {
            databasePath = GlobalDataPath.DATA_DIR_PATH_WIN;
        }
        else if (os.type() === 'Darwin') {
            databasePath = GlobalDataPath.DATA_DIR_PATH_MAC;
        }

       

        const entityDir = join(__dirname, '../../../module/**/*.local.entity{.ts,.js}')
        const moduleEntityDir = join(__dirname, '../../../lib/types/entity/**/*.local.entity{.ts,.js}')

        //  Logger.log(`Load Local Database Entity : `);
        //  Logger.log(` - ${entityDir} `);
        //  Logger.log(` - ${moduleEntityDir} `);

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