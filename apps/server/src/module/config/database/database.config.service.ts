import { DefaultDataSourceProvider } from "@crepen-nest/config/provider/database/default.database.provider";
import { SQLiteDataSourceProvider } from "@crepen-nest/config/provider/database/sqlite.database.provider";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DataSource } from "typeorm";


@Injectable()
export class DatabaseService {
    private activeDefault: DataSource = undefined;
    private activeLocal: DataSource = undefined;

    constructor(
        private configService: ConfigService
    ) {
        void this.getLocal();
    }


    getDefault = async (): Promise<DataSource> => {
        


        if (!this.activeDefault?.isInitialized) {
            this.activeDefault = await DefaultDataSourceProvider.getDataSource(this.configService).initialize();
        }

        return this.activeDefault;
    }

    getLocal = async (): Promise<DataSource> => {
        if (!this.activeLocal?.isInitialized) {
            this.activeLocal = await SQLiteDataSourceProvider.getDataSource().initialize();
        }

        return this.activeLocal;
    }
}