import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DefaultDataSource } from "src/module/config/database/default.database.config";
import { SQLiteDataSource } from "src/module/config/database/sqlite.database.config";

@Injectable()
export class CrepenSystemDatabaseService {
    constructor() { }

    testDefaultDatabaseConnect = async (config: ConfigService<unknown, boolean>) => {
        return DefaultDataSource.testConnection(config);
    }

    testConfigDatabaseConnect = async (config: ConfigService<unknown, boolean>) => {
        return SQLiteDataSource.testConnection(config);
    }

    getDefaultDataSource = async (config: ConfigService<unknown, boolean>) => {
        return DefaultDataSource.getDataSource(config);
    }

    getConfigDataSource = async (config: ConfigService<unknown, boolean>) => {
        return SQLiteDataSource.getDataSource(config);
    }
}