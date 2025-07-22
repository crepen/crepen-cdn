import { ConfigService } from "@nestjs/config";
import { join } from "path";
import { DataSource } from "typeorm";
import * as os from 'os';
import { CrepenDataPath } from "@crepen-nest/lib/enum/os-path.enum";

export class SQLiteDataSource {

    constructor(config: ConfigService<unknown, boolean>) {
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

        const entityDir = join(__dirname, '../../../app/**/*.entity.ce{.ts,.js}')


        this.dataSource = new DataSource({
            type: 'sqlite',
            database: join(databasePath, 'crepen_cdn.sqlite'),
            entities: [entityDir],
            synchronize: false
        })
    }

    dataSource: DataSource;


    static getDataSource = async (config: ConfigService<unknown, boolean>) => {

        const instance = new SQLiteDataSource(config);
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