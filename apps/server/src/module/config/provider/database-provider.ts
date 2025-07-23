import { CrepenSystemError } from "@crepen-nest/lib/error/system/common.system.error";
import { DataSource } from "typeorm";
import { SQLiteDataSourceProvider } from "../database/provider/sqlite.database.provider";

export class CrepenDatabaseProvider {
    constructor() {

    }



    static init = async () => {
        const instance = new CrepenDatabaseProvider();
        await instance.initSQLiteDatabase();
    }



    initSQLiteDatabase = async () => {

        let dataSource: DataSource;

        try {
            dataSource = await SQLiteDataSourceProvider.getDataSource().initialize();
        }
        catch (e) {
            throw new CrepenSystemError('Connect Failed', 'SQLite', {
                cause: e
            });
        }



        try {
            const tableList = await dataSource.query<{ name: string }[]>(`SELECT name FROM sqlite_master WHERE type='table'`);

            if (!tableList.find(x => x.name === 'config')) {
                await dataSource.query(`
                    CREATE TABLE config (
                        "key" TEXT NOT NULL,
                        value TEXT NOT NULL,
                        CONSTRAINT NewTable_PK PRIMARY KEY ("key")
                    )
                `);
            }

            if (!tableList.find(x => x.name === 'state')) {
                await dataSource.query(`
                    CREATE TABLE state (
                        "key" TEXT NOT NULL,
                        value TEXT NOT NULL,
                        CONSTRAINT NewTable_PK PRIMARY KEY ("key")
                    )
                `);
            }
        }
        catch (e) {
            console.log(e);
            throw new CrepenSystemError('Failed create config table', 'SQLite', {
                cause: e
            });
        }


    }


    // initDefaultDatabase = async (config: ConfigService<unknown, boolean>) => {
}