import { CrepenSystemError } from "@crepen-nest/lib/exception/crepen.system.exception";
import { ConfigService } from "@nestjs/config";
import { DataSource } from "typeorm";
import { DefaultDataSource } from "../database/default.database.config";
import { SQLiteDataSource } from "../database/sqlite.database.config";

export class CrepenDatabaseProvider {
    constructor(config: ConfigService<unknown, boolean>) {
        this.config = config;
    }

    config: ConfigService<unknown, boolean>;

    static init = async (config: ConfigService<unknown, boolean>) => {
        const instance = new CrepenDatabaseProvider(config);
        await instance.initSQLiteDatabase(config);

        const isConn = await DefaultDataSource.testConnection(config);
    }



    initSQLiteDatabase = async (config: ConfigService<unknown, boolean>) => {

        let dataSource: DataSource;

        try {
            dataSource = await SQLiteDataSource.getDataSource(config);
        }
        catch (e) {
            throw new CrepenSystemError('Connect Failed', 'SQLite' , {
                cause : e
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