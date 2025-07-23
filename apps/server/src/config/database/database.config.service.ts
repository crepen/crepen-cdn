import { Inject, Injectable, Scope } from "@nestjs/common";
import { CrepenDatabaseModuleOptions, MODULE_OPTIONS_TOKEN } from "./database.config.module";
import { ConfigService } from "@nestjs/config";
import { DataSource } from "typeorm";
import { DefaultDataSourceProvider } from "src/module/config/database/provider/default.database.provider";
import { SQLiteDataSourceProvider } from "src/module/config/database/provider/sqlite.database.provider";

@Injectable()
export class CrepenDatabaseService {
    private activeDefault: DataSource = undefined;
    private activeLocal: DataSource = undefined;

    constructor(
        private configService: ConfigService
    ) {
        void this.getLocal();
    }


    getDefault = async () => {
        const dataSource = this.activeDefault ?? DefaultDataSourceProvider.getDataSource(this.configService);

        if (!dataSource?.isInitialized) {
            this.activeDefault = await DefaultDataSourceProvider.getDataSource(this.configService).initialize();
            console.log('ACTIVE DEFAULT DATABASE');
        }

        return this.activeDefault;
    }

    getLocal = async () => {
        const dataSource = this.activeLocal ?? SQLiteDataSourceProvider.getDataSource();

        if (!dataSource.isInitialized) {
            this.activeLocal = await SQLiteDataSourceProvider.getDataSource().initialize();
            console.log('ACTIVE LOCAL DATABASE');
        }

        return this.activeLocal;
    }
}